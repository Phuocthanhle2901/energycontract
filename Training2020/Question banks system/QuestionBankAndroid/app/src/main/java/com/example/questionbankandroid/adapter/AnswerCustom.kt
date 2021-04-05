package com.example.questionbankandroid.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.questionbankandroid.R


class AnswerCustom(val listData:List<String>) : RecyclerView.Adapter<AnswerCustom.ViewHolder>() {
    inner class ViewHolder(val view: View, val context: Context): RecyclerView.ViewHolder(view){
        val answer = view.findViewById<TextView>(R.id.answer)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.custom_answer,parent,false)
        return ViewHolder(view,parent.context)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val data = listData[position]
        holder.answer.setText("${position +1}) $data")
    }

    override fun getItemCount(): Int {
        return listData.size
    }


}