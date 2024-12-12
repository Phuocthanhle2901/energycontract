package com.example.questionbankandroid

import android.Manifest
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.util.Patterns
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.lifecycle.ViewModelProvider
import com.example.questionbankandroid.data.UserInfoModel
import com.example.questionbankandroid.service.Retrofit
import com.example.questionbankandroid.util.IntenetViewModel
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.SocketTimeoutException

class CustomRecoveryPass : AppCompatActivity() {
    private lateinit var intenetViewModel: IntenetViewModel
    private var internetConnect: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.custom_recovery_pass)

        val email = intent.getStringExtra("email")
        val displayEmail = findViewById<TextInputEditText>(R.id.displayEmail)
        val pass = findViewById<TextInputEditText>(R.id.pass)
        val confirmPass = findViewById<TextInputEditText>(R.id.confirmpass)
        displayEmail.setText(email)
        focusEdt(pass)

        findViewById<Button>(R.id.update).setOnClickListener {
            val password = pass.text.toString().trim()
            val confirmpass = confirmPass.text.toString().trim()
            if (password.length<6) {
                Toast.makeText(
                    this,
                    "Password cannot be less than 6 characters!",
                    Toast.LENGTH_SHORT
                ).show()
            }
            else {
                if (confirmpass != password || confirmpass.length < 6) {
                    Toast.makeText(
                        this,
                        "ConfirmPassword and Password have to matches!",
                        Toast.LENGTH_SHORT
                    ).show()
                } else {
                   recoveryCode(email!!,password)
                }
            }
        }

        findViewById<Button>(R.id.back).setOnClickListener {
            startActivity(Intent(this,LoginActivity::class.java))
        }
        intenetViewModel = ViewModelProvider(this).get(IntenetViewModel::class.java)
        intenetViewModel.obseverLiveInternet.observe(this) {
            requestPermission(intenetViewModel.checkPermisstion())
            internetConnect = it
        }
    }

    private fun recoveryCode(email:String,password:String){
        if(internetConnect){
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val userInfoModel = Retrofit.getRetrofit().changePassword(email, password)
                    if(!userInfoModel.id.isNullOrEmpty()){
                        runOnUiThread {
                            Toast.makeText(this@CustomRecoveryPass, "Update Password Successful!", Toast.LENGTH_SHORT).show()
                            startActivity(Intent(this@CustomRecoveryPass, LoginActivity::class.java))
                            finish()
                        }
                    }
                }catch (e: SocketTimeoutException) {
                    runOnUiThread {
                        Toast.makeText(
                            this@CustomRecoveryPass,
                            "Failed access to API!",
                            Toast.LENGTH_SHORT
                        )
                            .show()
                    }
                }catch (e:Exception){
                    e.printStackTrace()
                }
            }
        }else{
            //ko co internet
            Toast.makeText(this, "No access Internet!", Toast.LENGTH_SHORT).show()
        }

    }
    private fun focusEdt(editText: EditText) {
        editText.requestFocus()
        val inputMethodManager =
            getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        inputMethodManager.showSoftInput(editText, 0)
    }

    private fun requestPermission(permissionGranted: Boolean) {
        if (!permissionGranted) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(
                    Manifest.permission.INTERNET,
                    Manifest.permission.ACCESS_WIFI_STATE,
                    Manifest.permission.ACCESS_NETWORK_STATE
                ),
                2727
            )
        }
    }

    private fun showPermissionSettings() {
        Toast.makeText(this, "Internet Permission disable!", Toast.LENGTH_SHORT).show()
        val intent = Intent(
            Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
            Uri.fromParts("package", packageName, null)
        )
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
    }

    override fun onResume() {
        super.onResume()
        try {
            intenetViewModel.registerConnectivity()
            intenetViewModel.checkConnections()
        } catch (ex: Exception) {

        }
    }

    override fun onPause() {
        super.onPause()
        try {
            intenetViewModel.unRegisterConnectivity()
        } catch (ex: Exception) {
            showPermissionSettings()
        }
    }
}