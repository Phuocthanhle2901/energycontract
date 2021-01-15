package com.example.questionbankandroid.adapter

import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.os.Build
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.core.text.HtmlCompat
import androidx.core.view.iterator
import androidx.recyclerview.widget.RecyclerView
import com.example.questionbankandroid.R
import com.example.questionbankandroid.data.AnswerUserModel
import com.example.questionbankandroid.data.QuestionModel
import com.whygraphics.multilineradiogroup.MultiLineRadioGroup

class DetailResultAdapter(val answerUserModel: AnswerUserModel): RecyclerView.Adapter<DetailResultAdapter.ViewHolder>(){
    inner class ViewHolder(val view: View, val context: Context):RecyclerView.ViewHolder(view){
        val cauhoi = view.findViewById<TextView>(R.id.cauhoi)
        val dapan = view.findViewById<TextView>(R.id.dapan)
        val multiRadio = view.findViewById<MultiLineRadioGroup>(R.id.multiRadio)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.custom_detail,parent,false)
        return ViewHolder(view,parent.context)
    }

    @RequiresApi(Build.VERSION_CODES.N)
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val cauhoi = answerUserModel.listCauHoi[position].question
        holder.cauhoi.text =  HtmlCompat.fromHtml(holder.context.getString(R.string.cauhoi,position+1,answerUserModel.listCauHoi[position].point,"${cauhoi.trim()}"),0)

        holder.multiRadio.maxInRow = 1
        var i = 0
        answerUserModel.dapAnTron[position].forEach {
            holder.multiRadio.addButtons(it.value)
            holder.multiRadio.getRadioButtonAt(i).isEnabled = false

            if(answerUserModel.dapAnUser[position.toString()] == it.key && answerUserModel.dapAnUser[position.toString()] != ""){
                holder.multiRadio.check(it.value)
                holder.multiRadio.getRadioButtonAt(i).highlightColor = Color.GREEN
            }
            if(answerUserModel.dapAnDung[position] == it.key){
                holder.dapan.text = "The correct Answer: ${it.value}"
                holder.dapan.setTypeface(Typeface.SANS_SERIF)
            }
            i++
        }
    }

    override fun getItemCount(): Int {
        return  answerUserModel.listCauHoi.size
    }
}