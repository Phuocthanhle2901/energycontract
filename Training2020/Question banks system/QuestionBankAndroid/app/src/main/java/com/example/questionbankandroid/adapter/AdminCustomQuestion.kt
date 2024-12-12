package com.example.questionbankandroid.adapter

import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.content.ContentProviderCompat.requireContext
import androidx.recyclerview.widget.RecyclerView
import com.example.questionbankandroid.R
import com.example.questionbankandroid.admin.home.AdminHomeViewModel
import com.example.questionbankandroid.data.QuestionModel
import com.example.questionbankandroid.service.Retrofit
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class AdminCustomQuestion(val listData:List<QuestionModel>,val viewModel: AdminHomeViewModel) : RecyclerView.Adapter<AdminCustomQuestion.ViewHolder>() {
    inner class ViewHolder(val view: View,val context:Context):RecyclerView.ViewHolder(view){
        val cauhoi = view.findViewById<TextView>(R.id.cauhoi)
        val list_item = view.findViewById<RecyclerView>(R.id.list_item)
        val correct = view.findViewById<TextView>(R.id.correct)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.show_question_admin,parent,false)
        return ViewHolder(view,parent.context)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val data = listData[position]
        val danhsachAnswer = data.answer

        holder.list_item.adapter = AnswerCustom(danhsachAnswer)
        holder.cauhoi.setText(holder.context.getString(R.string.cau_hoi,data.question))
        holder.correct.setText(holder.context.getString(R.string.the_correct_answer,danhsachAnswer[data.trueAnswer.toInt()]))

        holder.itemView.setOnLongClickListener {
            val dialog = AlertDialog.Builder(holder.context)
                .setTitle("DELETE QUESTION")
                .setMessage("Do you want to delete this question?")
                .setNegativeButton("Cancel", { dialog, _ -> dialog.dismiss() })
                .setPositiveButton("Ok", { _, _ ->
                    deleteQuestion(data.id!!,holder.context)
                })
                .setCancelable(false)
                .create()

            dialog.setOnShowListener {
                dialog.getButton(AlertDialog.BUTTON_NEGATIVE)
                    .setTextColor(holder.context.resources.getColor(android.R.color.holo_red_dark, null))
                dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                    .setTextColor(holder.context.resources.getColor(R.color.teal_700, null))

            }
            dialog.show()
            false
        }
    }

    override fun getItemCount(): Int {
        return listData.size
    }
    private fun deleteQuestion(id:String,context: Context){
        CoroutineScope(Dispatchers.IO).launch {
            try {
                Retrofit.getRetrofit().deleteQuestion(id)
                viewModel.getThemeAll()
                Toast.makeText(context, "Delete Successful!", Toast.LENGTH_SHORT).show()
            }catch (e:Exception){
                Log.d("CKNDeleteQuestion",e.message!!)
            }
        }
    }
}