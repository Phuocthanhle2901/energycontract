package com.example.questionbankandroid.ui.detail

import android.util.Log
import android.widget.Toast
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.questionbankandroid.data.AnswerUserModel
import com.example.questionbankandroid.service.Retrofit
import kotlinx.coroutines.launch
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.SocketTimeoutException

class DetailViewModel(val email:String,val ngaylam:String) : ViewModel() {
    private val _getAnswerUser:MutableLiveData<AnswerUserModel> = MutableLiveData()
    val getAnswerUser : LiveData<AnswerUserModel?>
        get() = _getAnswerUser

    init {
        viewModelScope.launch {
            try {
                val answerUserModel = Retrofit.getRetrofit().getAnswerUser(email,ngaylam)
                _getAnswerUser.value = answerUserModel
            }catch (e: SocketTimeoutException) {
            } catch (e: Exception) {
               // Log.d("LoginThongBao", e.message!!)
            }
        }

    }
}