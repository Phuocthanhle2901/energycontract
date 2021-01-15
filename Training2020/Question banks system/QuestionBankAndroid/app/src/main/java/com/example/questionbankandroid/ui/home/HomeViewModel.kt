package com.example.questionbankandroid.ui.home

import android.app.Application
import android.os.Build
import androidx.lifecycle.*
import com.example.questionbankandroid.data.ThemeQuestionModel
import com.example.questionbankandroid.service.Retrofit
import com.example.questionbankandroid.util.IntenetViewModel
import kotlinx.coroutines.launch
import java.net.SocketTimeoutException
class HomeViewModel(val application: Application) : ViewModel() {
    private var _listThemeQuestion : MutableLiveData<List<ThemeQuestionModel>> = MutableLiveData<List<ThemeQuestionModel>>()
    val listThemeQuestion:LiveData<List<ThemeQuestionModel>?>
    get() = _listThemeQuestion
    private val intenetViewModel = IntenetViewModel(application)
    val statusInternet:LiveData<Boolean>
    get() = _statusInternet
    private var _statusInternet = MutableLiveData<Boolean>()
    init {
        _statusInternet = intenetViewModel.obseverLiveInternet as MutableLiveData<Boolean>
        getThemeQuestion()
    }

    private fun getThemeQuestion(){
        viewModelScope.launch {
            try {
                _listThemeQuestion.value = Retrofit.getRetrofit().getThemeQuestion()
            }catch (e:Exception){
                e.printStackTrace()
            }
        }
    }

    fun checkPermisstion() = intenetViewModel.checkPermisstion()
    //Dang ki Internet
    fun registerConnectivity()  = intenetViewModel.registerConnectivity()

    //Huy dang ki Internet
    fun unRegisterConnectivity()= intenetViewModel.unRegisterConnectivity()
    fun checkConnections()  = intenetViewModel.checkConnections()
}