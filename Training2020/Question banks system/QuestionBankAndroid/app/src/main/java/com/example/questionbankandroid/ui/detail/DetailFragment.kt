package com.example.questionbankandroid.ui.detail


import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.example.questionbankandroid.adapter.DetailResultAdapter
import com.example.questionbankandroid.data.AnswerUserModel
import com.example.questionbankandroid.databinding.DetailFragmentBinding
import java.text.SimpleDateFormat

class DetailFragment : Fragment() {

    private lateinit var binding: DetailFragmentBinding
    private var answerUserModel:AnswerUserModel? = null
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        (activity as AppCompatActivity).supportActionBar?.hide()
        binding = DetailFragmentBinding.inflate(inflater,container,false)
        binding.recycleView.setHasFixedSize(true)

        val args = DetailFragmentArgs.fromBundle(requireArguments())
        val email = args.email
        val ngaylam = args.ngaylam

        val viewModelFactory = DetailViewModelFactory(email,ngaylam)
        val viewModel = ViewModelProvider(this,viewModelFactory)[DetailViewModel::class.java]

        viewModel.getAnswerUser.observe(viewLifecycleOwner, Observer {
            it?.let{
                val diem = answerUserModel!!.diem
                val tongdiem = answerUserModel!!.tongDiem

                val day =  SimpleDateFormat("dd/MM/yyyy").format(ngaylam.toLong())
                binding.tongdiem.text = "$diem/$tongdiem"
                binding.ngaylam.setText(day)
                binding.recycleView.adapter = DetailResultAdapter(answerUserModel!!)
            }
        })


        return binding.root
    }


}