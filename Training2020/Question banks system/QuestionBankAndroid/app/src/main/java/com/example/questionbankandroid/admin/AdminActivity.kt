package com.example.questionbankandroid.admin

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.TextView
import androidx.core.view.GravityCompat
import androidx.databinding.DataBindingUtil
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.findNavController
import androidx.navigation.ui.NavigationUI
import com.bumptech.glide.Glide
import com.example.questionbankandroid.LoginActivity
import com.example.questionbankandroid.R
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.databinding.ActivityAdminBinding
import com.example.questionbankandroid.service.Retrofit
import de.hdodenhof.circleimageview.CircleImageView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.*

class AdminActivity : AppCompatActivity() {
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var binding : ActivityAdminBinding
    private lateinit var view: View
    private lateinit var avatar: CircleImageView
    private lateinit var ten: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this,R.layout.activity_admin)

        setSupportActionBar(binding.toolbar)
        val navController = this.findNavController(R.id.nav_host_fragment_admin)
        drawerLayout = binding.drawerLayout

        NavigationUI.setupWithNavController(binding.navView, navController)
        NavigationUI.setupActionBarWithNavController(this, navController)
        NavigationUI.setupActionBarWithNavController(this, navController, drawerLayout)

        view = binding.navView.getHeaderView(0)
        avatar = view.findViewById(R.id.navHeaderImage)
        ten = view.findViewById<TextView>(R.id.name)

        ten.text = DataUtil.CURRENT_USER!!.fullname
        if(DataUtil.CURRENT_USER!!.avatar != ""){
            Glide.with(this).load(DataUtil.CURRENT_USER!!.avatar!!).into(avatar)
        }else{
            avatar.setImageResource(R.drawable.ic_baseline_person_24)
        }

        avatar.setOnClickListener {
            //thuVienAnh.launch("image/*")
        }
        Glide.with(this).resumeRequests()
        onNavigationListener()
    }
    override fun onSupportNavigateUp(): Boolean {
        val navController = this.findNavController(R.id.nav_host_fragment_admin)
        return NavigationUI.navigateUp(navController, drawerLayout)
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }

    private fun onNavigationListener(){
        binding.navView.setNavigationItemSelectedListener {
            when(it.itemId){
                R.id.logout -> {
                    it.setChecked(true)
                    binding.drawerLayout.closeDrawer(binding.navView)
                    removeFileUser()
                    startActivity(Intent(this, LoginActivity::class.java))
                    finish()
                }
                R.id.changePasswordFragment->{
                    it.setChecked(true)
                    binding.drawerLayout.closeDrawer(binding.navView)
                    findNavController(R.id.nav_host_fragment_admin).navigate(R.id.action_adminHomeFragment_to_changePasswordFragment3)
                }
            }
            false
        }
    }

    private fun removeFileUser(){
        val fileName = "taikhoanuser.txt"
        val content = ""

        var outputStream: FileOutputStream? = null
        try {
            outputStream = openFileOutput(fileName, MODE_PRIVATE)
            val br = BufferedWriter(OutputStreamWriter(outputStream))
            br.write(content)
            br.newLine()
            br.close()
        } catch (e: java.lang.Exception) {
            e.printStackTrace()
        }
    }

    override fun onPause() {
        super.onPause()
        Glide.with(this).pauseAllRequests()
    }

    override fun onResume() {
        super.onResume()
        Glide.with(this).resumeRequests()
    }
}