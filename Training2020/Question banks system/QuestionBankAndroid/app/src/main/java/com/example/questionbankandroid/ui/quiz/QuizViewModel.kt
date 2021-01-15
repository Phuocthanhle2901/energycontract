package com.example.questionbankandroid.ui.quiz

import android.os.CountDownTimer
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.questionbankandroid.data.QuestionModel
import com.example.questionbankandroid.service.Retrofit
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat

class QuizViewModel(val theme:String,val soluongcauhoi:Int) : ViewModel() {
    val listQuestion:LiveData<List<QuestionModel>?>
        get() = _listQuestion
    private var _listQuestion:MutableLiveData<List<QuestionModel>> = MutableLiveData()

    val time:LiveData<String?>
    get() = _time
    private var _time:MutableLiveData<String> = MutableLiveData()

    private var timer:MutableLiveData<CountDownTimer> = MutableLiveData()

    val statusStop:LiveData<Boolean>
        get()= _statusStop
    private val _statusStop:MutableLiveData<Boolean> = MutableLiveData(false)

    init {
        getListQuestionAll()
    }
    fun stopGame(){
        timer.value!!.cancel()
        _statusStop.value = true
    }
    fun startGame(){
        _statusStop.value = false
    }
    private fun getListQuestionAll(){
        Retrofit.getRetrofit().getAllQuestion(theme).enqueue(object :
            Callback<List<QuestionModel>> {
            override fun onResponse(
                call: Call<List<QuestionModel>>,
                response: Response<List<QuestionModel>>
            ) {
                if (response.body() != null) {
                    _listQuestion.value = response.body()//!!.subList(0,4)
                    val thoigian = _listQuestion.value!!.sumBy { it.timeallow }.toLong()
                    timer.value= object : CountDownTimer(thoigian*1000, 1000) {
                        override fun onTick(millisUntilFinished: Long) {
                            _time.value = SimpleDateFormat("mm:ss").format(millisUntilFinished)
                        }

                        override fun onFinish() {
                            stopGame()
                        }
                    }
                    (timer.value as CountDownTimer).start()
                } else {
                    Log.d("getListQuestionAll", "Khong co cau hoi")
                }

            }

            override fun onFailure(call: Call<List<QuestionModel>>, t: Throwable) {
                Log.d("getListQuestionAll", t.message.toString())
            }

        })
    }

    override fun onCleared() {
        super.onCleared()
        timer.value!!.cancel()
    }

}