package com.example.questionbankandroid.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.navigation.findNavController
import androidx.navigation.fragment.NavHostFragment
import androidx.recyclerview.widget.RecyclerView
import com.example.questionbankandroid.R
import com.example.questionbankandroid.data.AnswerUserModel
import com.example.questionbankandroid.ui.thanhtuu.ThanhTuuFragmentDirections
import java.text.SimpleDateFormat

class CustomThanhtuuAdapter(val listData:List<AnswerUserModel>) :RecyclerView.Adapter<CustomThanhtuuAdapter.ViewHolder>() {
    inner class ViewHolder(val view: View,val context:Context):RecyclerView.ViewHolder(view){
        val stt = view.findViewById<TextView>(R.id.stt)
        val ngonngu = view.findViewById<TextView>(R.id.ngonngu)
        val ngaylam = view.findViewById<TextView>(R.id.ngaylam)
        val diem = view.findViewById<TextView>(R.id.diem)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.custom_thanhtuu,parent,false)
        return ViewHolder(view,parent.context)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val data = listData[position]
        holder.stt.text = "${position+1}"
        holder.diem.text = "${data.diem}/${data.tongDiem}"
        holder.ngonngu.text = "${data.themeQuestion}"

        val ngaylam = SimpleDateFormat("hh:mm:ss dd/MM/yyyy").format(data.ngayLam.toLong())
        holder.ngaylam.text = ngaylam

        holder.itemView.setOnClickListener {
            it.findNavController().navigate(ThanhTuuFragmentDirections.actionThanhTuuFragmentToDetailFragment(data.email,data.ngayLam))
        }
    }

    override fun getItemCount(): Int {
       return listData.size
    }
}