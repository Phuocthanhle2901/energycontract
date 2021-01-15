package com.example.questionbankandroid.ui.detail


import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.example.questionbankandroid.adapter.DetailResultAdapter
import com.example.questionbankandroid.data.AnswerUserModel
import com.example.questionbankandroid.databinding.DetailFragmentBinding
import java.text.SimpleDateFormat

class DetailFragment : Fragment() {

    private lateinit var binding: DetailFragmentBinding
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        (activity as AppCompatActivity).supportActionBar?.show()
        (activity as AppCompatActivity).supportActionBar?.title = "Detail"
        binding = DetailFragmentBinding.inflate(inflater,container,false)
        binding.recycleView.setHasFixedSize(true)

        val args = DetailFragmentArgs.fromBundle(requireArguments())
        val email = args.email
        val ngaylam = args.ngaylam

        binding.recycleView.setHasFixedSize(true)


        val viewModelFactory = DetailViewModelFactory(email,ngaylam)
        val viewModel = ViewModelProvider(this,viewModelFactory)[DetailViewModel::class.java]

        viewModel.getAnswerUser.observe(viewLifecycleOwner, Observer {
            it?.let{
                val diem = it.diem
                val tongdiem = it.tongDiem

                val day =  SimpleDateFormat("hh:mm:ss dd/MM/yyyy").format(ngaylam.toLong())
                binding.tongdiem.text = "$diem/$tongdiem"
                binding.ngaylam.setText(day)
                binding.recycleView.adapter = DetailResultAdapter(it)
            }
        })
        binding.back.setOnClickListener {
            findNavController().navigate(DetailFragmentDirections.actionDetailFragmentToHomeFragment2())
        }

        return binding.root
    }


}