package com.example.questionbankandroid


import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuItem
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.databinding.DataBindingUtil
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.findNavController
import androidx.navigation.ui.NavigationUI
import com.bumptech.glide.Glide
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.data.UserInfoModel
import com.example.questionbankandroid.databinding.ActivityMainBinding
import com.example.questionbankandroid.service.Retrofit
import com.google.android.material.internal.NavigationMenuItemView
import com.google.android.material.navigation.NavigationView
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class MainActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView<ActivityMainBinding>(this,
            R.layout.activity_main)

        setSupportActionBar(binding.toolbar)
        val navController = this.findNavController(R.id.nav_host_fragment)
        drawerLayout = binding.drawerLayout

        NavigationUI.setupWithNavController(binding.navView,navController)
        NavigationUI.setupActionBarWithNavController(this,navController)
        NavigationUI.setupActionBarWithNavController(this, navController, drawerLayout)

        val view = binding.navView.getHeaderView(0)
        val avatar = view.findViewById<ImageView>(R.id.navHeaderImage)
        val ten = view.findViewById<TextView>(R.id.name)
        ten.setText(DataUtil.CURRENT_USER!!.fullname)

        if(DataUtil.CURRENT_USER!!.avatar != ""){
            Glide.with(this).load(DataUtil.CURRENT_USER!!.avatar ).into(avatar)
        }else{
            avatar.setImageResource(R.drawable.ic_baseline_person_24)
        }
        avatar.setOnClickListener {
            Toast.makeText(this, "Avatar is click", Toast.LENGTH_SHORT).show()
        }

        onNavigationListener()
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = this.findNavController(R.id.nav_host_fragment)
        return NavigationUI.navigateUp(navController, drawerLayout)
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
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
                R.id.logout->{
                    it.setChecked(true)
                    binding.drawerLayout.closeDrawer(binding.navView)
                    startActivity(Intent(this,LoginActivity::class.java))
                    finish()
                }
                R.id.thanhtuu ->{
                    it.setChecked(true)
                    binding.drawerLayout.closeDrawer(binding.navView)
                    startActivity(Intent(this,ThanhTuuActivity::class.java))
                }
                R.id.changePass->{

                }
            }
            false
        }

    }

}