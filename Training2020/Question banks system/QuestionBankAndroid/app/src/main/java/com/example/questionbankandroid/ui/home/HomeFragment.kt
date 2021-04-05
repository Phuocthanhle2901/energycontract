package com.example.questionbankandroid.ui.home

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.*
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.core.app.ActivityCompat
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.observe
import com.example.questionbankandroid.R
import com.example.questionbankandroid.adapter.ThemeQuestionAdapter
import com.example.questionbankandroid.data.ThemeQuestionModel
import com.example.questionbankandroid.databinding.FragmentHomeBinding
import com.example.questionbankandroid.util.IntenetViewModel
import java.text.Normalizer
import java.util.regex.Pattern


class HomeFragment : Fragment() {
    private lateinit var viewModel: HomeViewModel
    private lateinit var binding: FragmentHomeBinding
    private var internetConnect: Boolean = false

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        binding = FragmentHomeBinding.inflate(inflater, container, false)
        (activity as AppCompatActivity).supportActionBar?.show()
        setHasOptionsMenu(true)

        val viewModelFactory = HomeViewModelFactory(requireActivity().application)
        viewModel = ViewModelProvider(this, viewModelFactory).get(HomeViewModel::class.java)
        binding.recycleViewHome.setHasFixedSize(true)

        viewModel.statusInternet.observe(viewLifecycleOwner,{
            requestPermission(viewModel.checkPermisstion())
            internetConnect = it
            Log.d("CKNIntenetHome", it.toString())
            if (it) {
                binding.recycleViewHome.visibility = View.VISIBLE
                binding.rl.visibility = View.GONE
            } else {
                //ko co internet
                Toast.makeText(requireContext(), "No access Internet!", Toast.LENGTH_SHORT).show()
                binding.recycleViewHome.visibility = View.GONE
                binding.rl.visibility = View.VISIBLE
            }
        })
        viewModel.listThemeQuestion.observe(viewLifecycleOwner) {
            it?.let{
                binding.recycleViewHome.adapter = ThemeQuestionAdapter(it)
            }
        }
        return binding.root
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        super.onCreateOptionsMenu(menu, inflater)
        inflater.inflate(R.menu.home_menu, menu)

        val search = menu.findItem(R.id.seach).actionView as SearchView
        search.setIconifiedByDefault(true)
        search.queryHint = "Search..."

        //search listener
        search.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                //Khi nhan search tu keyboard
                if (internetConnect) {
                    viewModel.listThemeQuestion.observe(viewLifecycleOwner) {
                        it?.let { list ->
                            val a = mutableListOf<ThemeQuestionModel>()
                            list.forEach {
                                if (it.name.toLowerCase().contains(query!!.toLowerCase().vNToE())) {
                                    a.add(it)
                                }
                            }
                            binding.recycleViewHome.adapter = ThemeQuestionAdapter(a)
                        }
                    }
                } else {
                    //ko co internet
                    Toast.makeText(requireContext(), "No access Internet!", Toast.LENGTH_SHORT)
                        .show()
                }

                return false
            }

            @SuppressLint("DefaultLocale")
            override fun onQueryTextChange(newText: String?): Boolean {
                if (internetConnect) {
                    viewModel.listThemeQuestion.observe(viewLifecycleOwner) {
                        it?.let { list ->
                            val a = mutableListOf<ThemeQuestionModel>()
                            list.forEach {
                                if (it.name.toLowerCase()
                                        .contains(newText!!.toLowerCase().vNToE())
                                ) {
                                    a.add(it)
                                }
                            }
                            binding.recycleViewHome.adapter = ThemeQuestionAdapter(a)
                        }
                    }
                } else {
                    //ko co internet
                    Toast.makeText(requireContext(), "No access Internet!", Toast.LENGTH_SHORT)
                        .show()
                }

                return false
            }
        })
    }


    private fun String.vNToE(): String {
        val temp = Normalizer.normalize(this, Normalizer.Form.NFD)
        val pattern = Pattern.compile("\\p{InCOMBINING_DIACRITICAL_MARKS}+")
        return pattern.matcher(temp).replaceAll("")
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
}