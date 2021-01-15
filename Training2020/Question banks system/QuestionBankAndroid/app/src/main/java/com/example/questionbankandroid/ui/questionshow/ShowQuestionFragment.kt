package com.example.questionbankandroid.ui.questionshow


import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.findNavController
import com.bumptech.glide.Glide
import com.example.questionbankandroid.databinding.ShowQuestionFragmentBinding

class ShowQuestionFragment : Fragment() {

    private lateinit var binding: ShowQuestionFragmentBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = ShowQuestionFragmentBinding.inflate(inflater, container, false)
        (activity as AppCompatActivity).supportActionBar?.hide()

        val args = ShowQuestionFragmentArgs.fromBundle(requireArguments())
        if (args.image != "") {
            Glide.with(requireContext()).load(args.image).into(binding.image)
        }
        val theme = args.theme
        binding.playButton.setOnClickListener {
            val number = binding.spinner.selectedItem.toString().toInt()
            findNavController().navigate(ShowQuestionFragmentDirections.actionShowQuestionFragmentToQuizFragment(theme,number))
        }
        return binding.root
    }


}