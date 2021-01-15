package com.example.questionbankandroid

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.util.Patterns
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.lifecycle.ViewModelProvider
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.data.UserInfoModel
import com.example.questionbankandroid.databinding.ActivityLoginBinding
import com.example.questionbankandroid.service.Retrofit
import com.example.questionbankandroid.util.IntenetViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.SocketTimeoutException

@Suppress("DEPRECATION")
@SuppressLint("CheckResult")
class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var intenetViewModel: IntenetViewModel
    private var internetConnect: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        focusEdt(binding.edtEmail)


        binding.btnLogin.setOnClickListener {
            val email = binding.edtEmail.text.toString().trim()
            val pass = binding.edtPassword.text.toString().trim()

            if (email == "") {
                binding.edtEmail.error = "Email not blank!"
            } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                binding.edtEmail.error = "Email  illegal!"
            } else {
                if (pass.length < 6) {
                    binding.edtPassword.error = "Password at least 6 characters!"
                } else {
                    dangNhap(email, pass)
                }
            }
        }

        binding.dangkingay.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        binding.quenmatkhau.setOnClickListener {
            startActivity(Intent(this, RecoveryPassword::class.java))
        }
        intenetViewModel = ViewModelProvider(this).get(IntenetViewModel::class.java)
        intenetViewModel.obseverLiveInternet.observe(this) {
            requestPermission(intenetViewModel.checkPermisstion())
            internetConnect = it
        }
    }

    private fun dangNhap(email: String, pass: String) {
        if (internetConnect) {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val userInfoModel = Retrofit.getRetrofit().login(email, pass)
                    if (userInfoModel == null) {
                        Toast.makeText(
                            this@LoginActivity,
                            "Account is not exist!",
                            Toast.LENGTH_SHORT
                        ).show()
                    } else {
                        DataUtil.CURRENT_USER = userInfoModel
                        val intent = Intent(this@LoginActivity, MainActivity::class.java)
                        startActivity(intent)
                        finish()
                    }
                } catch (e: SocketTimeoutException) {
                    runOnUiThread {
                        Toast.makeText(
                            this@LoginActivity,
                            "Failed access to API!",
                            Toast.LENGTH_SHORT
                        )
                            .show()
                    }
                }catch (e:Exception){
                    e.printStackTrace()
                }
            }
        } else {
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