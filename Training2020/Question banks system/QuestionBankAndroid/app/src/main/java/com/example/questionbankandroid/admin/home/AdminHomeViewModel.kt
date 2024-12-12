package com.example.questionbankandroid.admin.home

import android.app.Application
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.questionbankandroid.data.QuestionModel
import com.example.questionbankandroid.data.ThemeQuestionModel
import com.example.questionbankandroid.service.Retrofit
import com.example.questionbankandroid.util.IntenetViewModel
import kotlinx.coroutines.launch

class AdminHomeViewModel(val application: Application) : ViewModel() {
    private var _listQuestion : MutableLiveData<List<QuestionModel>> = MutableLiveData<List<QuestionModel>>()
    val listQuestion: LiveData<List<QuestionModel>?>
        get() = _listQuestion
    private var _listTheme : MutableLiveData<List<ThemeQuestionModel>> = MutableLiveData<List<ThemeQuestionModel>>()
    val listTheme: LiveData<List<ThemeQuestionModel>?>
        get() = _listTheme

    private val intenetViewModel = IntenetViewModel(application)
    val statusInternet: LiveData<Boolean>
        get() = _statusInternet
    private var _statusInternet = MutableLiveData<Boolean>()
    init {
        _statusInternet = intenetViewModel.obseverLiveInternet as MutableLiveData<Boolean>
        getThemeQuestion()
    }

    private fun getThemeQuestion(){
        viewModelScope.launch {
            try {
                _listQuestion.value = Retrofit.getRetrofit().getAllQuestion().reversed()
                _listTheme.value = Retrofit.getRetrofit().getThemeQuestion()
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

    fun getThemeQuestion(theme:String){
        viewModelScope.launch {
            try {
                _listQuestion.value = Retrofit.getRetrofit().getAllQuestion(theme).reversed()
            }catch (e:Exception){
                e.printStackTrace()
            }
        }
    }
    fun getThemeAll(){
        viewModelScope.launch {
            try {
                _listQuestion.value = Retrofit.getRetrofit().getAllQuestion().reversed()
            }catch (e:Exception){
                e.printStackTrace()
            }
        }
    }
}