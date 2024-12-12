package com.example.questionbankandroid.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RadioButton
import android.widget.RadioGroup
import android.widget.TextView
import androidx.core.text.HtmlCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.questionbankandroid.R
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.data.QuestionModel
import com.whygraphics.multilineradiogroup.MultiLineRadioGroup

class QuestionAdapter(val listData:List<QuestionModel>): RecyclerView.Adapter<QuestionAdapter.ViewHolder>() {
    inner class ViewHolder(val view: View, val context: Context): RecyclerView.ViewHolder(view){
        val cauhoi = view.findViewById<TextView>(R.id.cauhoi)
        val multiRadioGroup = view.findViewById<MultiLineRadioGroup>(R.id.multiRadio)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.custom_question,parent,false)
        return ViewHolder(view,parent.context)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val data = listData[position]
        //tron dap an
        val answer =  data.answer
        //chuyen doi tu list sang map
        val mapAnswer =answer.mapIndexed { index, s -> index.toString() to s }.shuffled().toMap()

        holder.multiRadioGroup.maxInRow = 1
        mapAnswer.forEach {
            holder.multiRadioGroup.addButtons(it.value)
        }
        holder.cauhoi.text = HtmlCompat.fromHtml(holder.context.getString(R.string.cauhoi,position+1,data.point,"${data.question.trim()}"),0)
        DataUtil.mapDapAn[position.toString()] = ""
        holder.multiRadioGroup.setOnCheckedChangeListener(object : MultiLineRadioGroup.OnCheckedChangeListener{
            override fun onCheckedChanged(p0: ViewGroup?, p1: RadioButton?) {
                //user chon dap an
                mapAnswer.forEach {
                    if(it.value == p1!!.text){
                        DataUtil.mapDapAn[position.toString()] = it.key
                    }
                }
            }
        })
        DataUtil.mapDapAnTron.add(mapAnswer)
    }

    override fun getItemCount(): Int {
        return listData.size
    }
}