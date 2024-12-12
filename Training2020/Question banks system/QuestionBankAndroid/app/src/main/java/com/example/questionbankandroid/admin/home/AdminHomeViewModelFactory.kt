package com.example.questionbankandroid.admin.home

import android.app.Application
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

class AdminHomeViewModelFactory(val application: Application) : ViewModelProvider.Factory {
    override fun <T : ViewModel?> create(modelClass: Class<T>): T {
        if(modelClass.isAssignableFrom(AdminHomeViewModel::class.java)){
            return AdminHomeViewModel(application) as T
        }
        throw IllegalArgumentException()
    }
}