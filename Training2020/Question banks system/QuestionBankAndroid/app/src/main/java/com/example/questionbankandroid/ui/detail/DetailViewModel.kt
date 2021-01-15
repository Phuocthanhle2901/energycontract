package com.example.questionbankandroid.ui.detail

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.questionbankandroid.data.AnswerUserModel
import com.example.questionbankandroid.service.Retrofit
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DetailViewModel(val email:String,val ngaylam:String) : ViewModel() {
    private val _getAnswerUser:MutableLiveData<AnswerUserModel> = MutableLiveData()
    val getAnswerUser : LiveData<AnswerUserModel?>
        get() = _getAnswerUser

    init {
        Retrofit.getRetrofit().getAnswerUser(email,ngaylam).enqueue(object:
            Callback<AnswerUserModel> {
            override fun onResponse(
                call: Call<AnswerUserModel>,
                response: Response<AnswerUserModel>
            ) {
                _getAnswerUser.value = response.body()

            }
            override fun onFailure(call: Call<AnswerUserModel>, t: Throwable) {
            }

        })
    }
}