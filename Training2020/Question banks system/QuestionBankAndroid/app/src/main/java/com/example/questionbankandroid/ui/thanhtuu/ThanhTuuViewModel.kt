package com.example.questionbankandroid.ui.thanhtuu

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.questionbankandroid.data.AnswerUserModel
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.service.Retrofit
import kotlinx.coroutines.launch
import java.net.SocketTimeoutException

class ThanhTuuViewModel : ViewModel() {
    val listData :LiveData<List<AnswerUserModel>?>
    get() = _listData
    private val _listData = MutableLiveData<List<AnswerUserModel>>()
    init {
        viewModelScope.launch {
            try {
                val list = Retrofit.getRetrofit().getAllAnswerUser(DataUtil.CURRENT_USER!!.email!!)
                _listData.value =list
            }catch (e: SocketTimeoutException) {
            } catch (e: Exception) {
                // Log.d("LoginThongBao", e.message!!)
            }
        }
    }
}