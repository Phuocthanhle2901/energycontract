package com.example.questionbankandroid.ui.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

class QuizViewModelFactory(val theme:String,val soluongcauhoi:Int) :ViewModelProvider.Factory {
    override fun <T : ViewModel?> create(modelClass: Class<T>): T {
        if(modelClass.isAssignableFrom(QuizViewModel::class.java)){
            return QuizViewModel(theme,soluongcauhoi) as T
        }
        throw IllegalArgumentException()
    }
}