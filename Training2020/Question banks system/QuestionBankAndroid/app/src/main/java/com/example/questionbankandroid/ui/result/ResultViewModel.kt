package com.example.questionbankandroid.ui.result

import android.app.Application
import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.questionbankandroid.util.IntenetViewModel

class ResultViewModel(val application: Application) : ViewModel(){
    private val intenetViewModel = IntenetViewModel(application)
    val statusInternet: LiveData<Boolean>
    init {
        statusInternet = intenetViewModel.obseverLiveInternet
    }

    fun checkPermisstion() = intenetViewModel.checkPermisstion()
    //Dang ki Internet
    fun registerConnectivity()  = intenetViewModel.registerConnectivity()

    //Huy dang ki Internet
    fun unRegisterConnectivity()= intenetViewModel.unRegisterConnectivity()
    fun checkConnections()  = intenetViewModel.checkConnections()
}