package com.example.questionbankandroid.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.questionbankandroid.R
import com.example.questionbankandroid.data.ThemeQuestionModel
import com.example.questionbankandroid.ui.home.HomeFragmentDirections

class ThemeQuestionAdapter(val listThemeQuestionAdapter:List<ThemeQuestionModel>) : RecyclerView.Adapter<ThemeQuestionAdapter.ViewHolder>() {
    inner class ViewHolder(val view:View,val context: Context):RecyclerView.ViewHolder(view){
        val img = view.findViewById<ImageView>(R.id.hinhAnhNgonNgu)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.custom_grid_home_item,parent,false)
        return ViewHolder(view,parent.context)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val data = listThemeQuestionAdapter[position]

        if(data.image == ""){
            holder.img.setImageResource(R.drawable.ic_launcher_background)
        }else{
            Glide.with(holder.context).load(data.image).into(holder.img)
        }
        holder.itemView.setOnClickListener {
            it.findNavController().navigate(HomeFragmentDirections.actionHomeFragmentToShowQuestionFragment(data.image,data.name))
        }
    }

    override fun getItemCount(): Int {
        return listThemeQuestionAdapter.size
    }
}