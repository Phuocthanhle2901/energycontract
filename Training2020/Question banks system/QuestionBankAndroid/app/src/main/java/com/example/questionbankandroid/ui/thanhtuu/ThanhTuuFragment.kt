package com.example.questionbankandroid.ui.thanhtuu

import androidx.lifecycle.ViewModelProvider
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import com.example.questionbankandroid.R
import com.example.questionbankandroid.adapter.CustomThanhtuuAdapter
import com.example.questionbankandroid.databinding.ThanhTuuFragmentBinding

class ThanhTuuFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val binding = ThanhTuuFragmentBinding.inflate(inflater,container,false)
        val viewModel = ViewModelProvider(this)[ThanhTuuViewModel::class.java]

        (activity as AppCompatActivity).supportActionBar?.title = "Achievement"
        (activity as AppCompatActivity).supportActionBar?.show()


        viewModel.listData.observe(viewLifecycleOwner, Observer {
            it?.let {
                binding.recycleViewHome.adapter = CustomThanhtuuAdapter(it.reversed())
            }
        })

        return binding.root
    }


}