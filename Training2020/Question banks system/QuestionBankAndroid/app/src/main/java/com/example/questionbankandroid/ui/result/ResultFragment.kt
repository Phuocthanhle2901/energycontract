package com.example.questionbankandroid.ui.result

import android.Manifest
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.observe
import androidx.navigation.fragment.findNavController
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.databinding.ResultFragmentBinding



class ResultFragment : Fragment() {

    private lateinit var binding: ResultFragmentBinding
    private lateinit var viewModel: ResultViewModel
    private var internetConnect: Boolean = false

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding =ResultFragmentBinding .inflate(inflater, container, false)

        val args = ResultFragmentArgs.fromBundle(requireArguments())
        val diem = args.diem
        val tongdiem = args.tongdiem
        val ngaylam = args.ngaylam
        val thoigianlam = args.thoigianlam

        binding.diem.text = "$diem/$tongdiem points"
        if(thoigianlam<60)
           binding.time.text = "${thoigianlam} seconds"
        else
            binding.time.text = "${thoigianlam/60} minute ${thoigianlam - thoigianlam/60*60} seconds"

        binding.btnBack.setOnClickListener {
            findNavController().navigate(ResultFragmentDirections.actionResultFragmentToHomeFragment())
        }
        binding.btnDetail.setOnClickListener {
            if(internetConnect)
                findNavController().navigate(
                    ResultFragmentDirections.actionResultFragmentToDetailFragment(
                        DataUtil.CURRENT_USER!!.email!!,
                        ngaylam
                    )
                )
            else
                Toast.makeText(requireContext(), "No Access Internet!", Toast.LENGTH_SHORT).show()
        }
        val viewModelFactory = ResultFactory(requireActivity().application)
        viewModel = ViewModelProvider(this, viewModelFactory).get(ResultViewModel::class.java)
        viewModel.statusInternet.observe(viewLifecycleOwner) {
            requestPermission(viewModel.checkPermisstion())
            internetConnect = it
        }
        return binding.root
    }

    override fun onResume() {
        super.onResume()
        try {
            viewModel.registerConnectivity()
            viewModel.checkConnections()
        } catch (ex: Exception) {

        }
    }

    override fun onPause() {
        super.onPause()
        try {
            viewModel.unRegisterConnectivity()
        } catch (ex: Exception) {
            showPermissionSettings()
        }
    }

    private fun showPermissionSettings() {
        Toast.makeText(requireContext(), "Internet Permission disable!", Toast.LENGTH_SHORT).show()
        val intent = Intent(
            Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
            Uri.fromParts("package", requireContext().packageName, null)
        )
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
    }

    private fun requestPermission(permissionGranted: Boolean) {
        if (!permissionGranted) {
            ActivityCompat.requestPermissions(
                requireActivity(),
                arrayOf(
                    Manifest.permission.INTERNET,
                    Manifest.permission.ACCESS_WIFI_STATE,
                    Manifest.permission.ACCESS_NETWORK_STATE
                ),
                2727
            )
        }
    }

}