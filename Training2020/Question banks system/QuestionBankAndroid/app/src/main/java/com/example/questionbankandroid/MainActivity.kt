package com.example.questionbankandroid

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.databinding.DataBindingUtil
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.findNavController
import androidx.navigation.ui.NavigationUI
import com.bumptech.glide.Glide
import com.example.questionbankandroid.admin.AdminActivity
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.databinding.ActivityMainBinding
import com.example.questionbankandroid.service.Retrofit
import de.hdodenhof.circleimageview.CircleImageView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.*


class MainActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var binding: ActivityMainBinding
    private lateinit var view:View
    private lateinit var avatar:CircleImageView
    private lateinit var ten:TextView
    private var imageUri : Uri?= null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView<ActivityMainBinding>(
            this,
            R.layout.activity_main
        )
        setSupportActionBar(binding.toolbar)
        val navController = this.findNavController(R.id.nav_host_fragment)
        drawerLayout = binding.drawerLayout

        NavigationUI.setupWithNavController(binding.navView, navController)
        NavigationUI.setupActionBarWithNavController(this, navController)
        NavigationUI.setupActionBarWithNavController(this, navController, drawerLayout)

        view = binding.navView.getHeaderView(0)
        avatar = view.findViewById(R.id.navHeaderImage)
        ten = view.findViewById<TextView>(R.id.name)
        avatar.setOnClickListener {
            //thuVienAnh.launch("image/*")
        }
        Glide.with(this).resumeRequests()
        onNavigationListener()
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = this.findNavController(R.id.nav_host_fragment)
        return NavigationUI.navigateUp(navController, drawerLayout)
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }

    override fun onStart() {
        super.onStart()
        checkUser()
    }
    override fun onResume() {
        super.onResume()
        Glide.with(this).resumeRequests()
    }

    override fun onPause() {
        super.onPause()
        Glide.with(this).pauseAllRequests()
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
                R.id.thanhtuu -> {
                    it.setChecked(true)
                    binding.drawerLayout.closeDrawer(binding.navView)
                    findNavController(R.id.nav_host_fragment).navigate(R.id.action_homeFragment_to_thanhTuuFragment)
                }
                R.id.changePasswordFragment -> {
                    it.setChecked(true)
                    binding.drawerLayout.closeDrawer(binding.navView)
                    findNavController(R.id.nav_host_fragment).navigate(R.id.action_homeFragment_to_changePasswordFragment)
                }
            }
            false
        }
    }

    private fun checkUser(){
        readData()
    }

    private fun readData() {
        try {
            val fileInputStream: FileInputStream = openFileInput("taikhoanuser.txt")
            val br = BufferedReader(InputStreamReader(fileInputStream))
            val line: String? = br.readLine()
            if(line.isNullOrEmpty() || line.length < 5){
                //hien thi Login
                val intent = Intent(this, LoginActivity::class.java)
                startActivity(intent)
                finish()
            }else{
                val email = line.split("----")[0]
                val pass = line.split("----")[1]
                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        val userInfoModel = Retrofit.getRetrofit().login(email, pass)
                        if (userInfoModel.email.isNullOrEmpty()) {
                            val intent = Intent(this@MainActivity, LoginActivity::class.java)
                            startActivity(intent)
                            finish()
                        }else{
                            runOnUiThread {
                                DataUtil.CURRENT_USER = userInfoModel
                                if(userInfoModel.role == 2){
                                    binding.drawerLayout.visibility = View.GONE
                                    val intent = Intent(this@MainActivity, AdminActivity::class.java)
                                    startActivity(intent)
                                    finish()
                                }else{
                                    binding.drawerLayout.visibility = View.VISIBLE
                                    ten.setText(DataUtil.CURRENT_USER!!.fullname)
                                    if(DataUtil.CURRENT_USER!!.avatar!! != ""){
                                        Glide.with(this@MainActivity).load(DataUtil.CURRENT_USER!!.avatar.toString()).into(avatar)
                                    }else{
                                        avatar.setImageResource(R.drawable.ic_baseline_person_24)
                                    }
                                }
                            }
                        }
                    } catch (e: Exception) {
                        Log.d("LoginThongBaoMain", e.message!!)
                    }
                }
            }
            br.close()
            fileInputStream.close()
        } catch (e: Exception) {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
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

    //Khai bao activity result lay anh tu thu vien
    /*private val thuVienAnh = registerForActivityResult(ActivityResultContracts.GetContent()) {
        it?.let{
            imageUri = it
            showDialogLoadImage()
        }
    }
    private fun showDialogLoadImage() {
        val dialog = AlertDialog.Builder(this)
            .setTitle("CHANGE AVATAR")
            .setMessage("Are you ready change avatar?")
            .setNegativeButton("Cancel", { dialog, _ -> dialog.dismiss() })
            .setPositiveButton("Ok", { _, _ ->
                uploadThongTinCaNhan()
            })
            .setCancelable(false)
            .create()

        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_NEGATIVE)
                .setTextColor(resources.getColor(android.R.color.holo_red_dark, null))
            dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                .setTextColor(resources.getColor(R.color.teal_700, null))

        }
        dialog.show()
    }

    private fun uploadThongTinCaNhan(){

        *//*CoroutineScope(Dispatchers.IO).launch {
            try{

            }catch (e: Exception){
                Log.d("LoiUpdateImage", e.message!!)
            }
        }*//*
    }*/
}