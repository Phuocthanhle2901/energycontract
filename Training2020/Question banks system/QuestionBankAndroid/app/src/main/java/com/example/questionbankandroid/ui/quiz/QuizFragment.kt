package com.example.questionbankandroid.ui.quiz

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.example.questionbankandroid.adapter.QuestionAdapter
import com.example.questionbankandroid.data.AnswerUserModel
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.data.QuestionModel
import com.example.questionbankandroid.databinding.QuizFragmentBinding
import com.example.questionbankandroid.service.Retrofit
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.ParsePosition
import java.text.SimpleDateFormat
import java.util.*

class QuizFragment : Fragment() {

    private lateinit var binding:QuizFragmentBinding
    private lateinit var viewModel: QuizViewModel
    private var listSave = listOf<QuestionModel>()
    private lateinit var dapAns :MutableMap<Int,String>
    private var tongDiem = 0
    private var tongThoiGian = 0


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View{
        val args = QuizFragmentArgs.fromBundle(requireArguments())
        val soluongCauHoi = args.number
        val themeQuestion = args.theme
        binding = QuizFragmentBinding.inflate(inflater,container,false)
        (activity as AppCompatActivity).supportActionBar?.hide()
        DataUtil.mapDapAn= mutableMapOf()
        DataUtil.mapDapAnTron = mutableListOf()
        dapAns = mutableMapOf()

        val viewModelFactory = QuizViewModelFactory(themeQuestion,soluongCauHoi)
        viewModel = ViewModelProvider(this,viewModelFactory).get(QuizViewModel::class.java)

        viewModel.listQuestion.observe(viewLifecycleOwner, Observer {
            it?.let {
                listSave = it.shuffled()
                dapAns = mutableMapOf()
                tongDiem = listSave.sumBy { it.point }
                tongThoiGian = listSave.sumBy { it.timeallow }

                listSave.forEachIndexed { index, questionModel ->
                    //dap an moi cau hoi vd: dapAns[0] = "0"
                    dapAns[index] = questionModel.trueAnswer
                }
                binding.recycleView.adapter = QuestionAdapter(listSave)

            }
        })

        viewModel.time.observe(viewLifecycleOwner, Observer {
           it?.let {
               binding.thoigian.setText(it)
           }
        })

        viewModel.statusStop.observe(viewLifecycleOwner, Observer {
            if (it) {
                stopText(themeQuestion)
                viewModel.startGame()
            }
        })

        binding.submit.setOnClickListener{
            var check = true
            DataUtil.mapDapAn.forEach { t, u ->
                if(u=="" && check){
                    Toast.makeText(requireContext(), "Please choose answer for question ${t.toInt()+1} ", Toast.LENGTH_SHORT).show()
                    check = false
                    return@forEach
                }
            }
            if(check)
                viewModel.stopGame()
        }

        return binding.root
    }
    private fun stopText(themeQuestion:String){
        val thoigian = binding.thoigian.text.split(":")
        val thoigianconlai = thoigian[0].toInt()*60 + thoigian[1].toInt()

        val thoigianlam = (tongThoiGian - thoigianconlai).toInt()
        var diem = 0
        DataUtil.mapDapAn.forEach { t, u ->
            Log.d("hirnthi",u)
            Log.d("hirnthi",dapAns[t.toInt()]!!)
            if(u==dapAns[t.toInt()]){
                Log.d("hirnthi1",u)
                diem += listSave[t.toInt()].point
            }
        }
        val ngaylam = System.currentTimeMillis().toString()
        val answerUserModel = AnswerUserModel(
            dapAnDung =  dapAns,
            dapAnUser = DataUtil.mapDapAn,
            diem = diem,
            email = DataUtil.CURRENT_USER!!.email!!,
            listCauHoi= listSave,
            ngayLam = ngaylam,
            thoiGianLam = thoigianlam,
            tongDiem = tongDiem,
            tongThoiGian = tongThoiGian,
            dapAnTron = DataUtil.mapDapAnTron.toList(),
            themeQuestion
        )
        Retrofit.getRetrofit().createAnswerUser(answerUserModel).enqueue(object:Callback<AnswerUserModel>{
            override fun onResponse(
                call: Call<AnswerUserModel>,
                response: Response<AnswerUserModel>
            ) {
                findNavController().navigate(QuizFragmentDirections.actionQuizFragmentToResultFragment(diem,tongDiem,ngaylam,thoigianlam))
            }

            override fun onFailure(call: Call<AnswerUserModel>, t: Throwable) {
                Log.d("CKNLoi",t.message.toString())
            }

        })
    }


}