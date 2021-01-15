package com.example.questionbankandroid.ui

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import com.example.questionbankandroid.R
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.databinding.ResultFragmentBinding


class ResultFragment : Fragment() {

    private lateinit var binding: ResultFragmentBinding

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

        binding.diem.text = "$diem/$tongdiem point"
        if(thoigianlam<60)
           binding.time.text = "${thoigianlam} second"
        else
            binding.time.text = "${thoigianlam/60} minute ${thoigianlam - thoigianlam/60*60} second"

        binding.btnBack.setOnClickListener {
            findNavController().navigate(ResultFragmentDirections.actionResultFragmentToHomeFragment())
        }
        binding.btnDetail.setOnClickListener {
            findNavController().navigate(ResultFragmentDirections.actionResultFragmentToDetailFragment(DataUtil.CURRENT_USER!!.email,ngaylam))
        }
        return binding.root
    }



}