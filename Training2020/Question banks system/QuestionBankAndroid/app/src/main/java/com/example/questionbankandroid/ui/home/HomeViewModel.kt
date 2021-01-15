package com.example.questionbankandroid.ui.home


import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.questionbankandroid.data.ThemeQuestionModel
import com.example.questionbankandroid.service.Retrofit
import kotlinx.coroutines.launch

class HomeViewModel : ViewModel() {

    val listThemeQuestion : LiveData<List<ThemeQuestionModel>?>
        get() = _listThemeQuestion
    private var _listThemeQuestion= MutableLiveData<List<ThemeQuestionModel>>()

    init {
        getThemeQuestion()
    }

    private fun getThemeQuestion(){
        viewModelScope.launch {
            try {
                _listThemeQuestion.value = Retrofit.getRetrofit().getThemeQuestion()
            } catch (e: Exception) {

            }
        }
    }
}