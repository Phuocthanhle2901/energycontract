package com.example.questionbankandroid

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class StartActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_start)
    }
    override fun onStart() {
        super.onStart()
        CoroutineScope(Dispatchers.Main).launch{
            delay(3000)
            startActivity(Intent(this@StartActivity,LoginActivity::class.java))
            finish()
        }
    }
}