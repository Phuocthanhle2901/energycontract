package com.example.questionbankandroid

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.util.Patterns
import android.view.LayoutInflater
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.app.ActivityCompat
import androidx.core.content.ContentProviderCompat.requireContext
import androidx.core.text.HtmlCompat
import androidx.lifecycle.ViewModelProvider
import com.example.questionbankandroid.data.UserInfoModel
import com.example.questionbankandroid.databinding.ActivityRecoveryPasswordBinding
import com.example.questionbankandroid.mail.Mailer
import com.example.questionbankandroid.service.Retrofit
import com.example.questionbankandroid.util.IntenetViewModel
import com.google.android.material.textfield.TextInputEditText
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.SocketTimeoutException

class RecoveryPassword : AppCompatActivity() {
    private lateinit var binding: ActivityRecoveryPasswordBinding
    private lateinit var intenetViewModel: IntenetViewModel
    private var internetConnect: Boolean = false


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRecoveryPasswordBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolBar)
        supportActionBar?.title = "Recovery Password"
        supportActionBar?.setDisplayShowHomeEnabled(true)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolBar.setNavigationOnClickListener {
            finish()
        }
        focusEdt(binding.edtEmail)

        binding.sendEmail.setOnClickListener {
            val email = binding.edtEmail.text.toString().trim()
            val code = (100000..999999).random().toString()

            if (email == "") {
                binding.edtEmail.error = "Email not blank!"
            } else {
                if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                    binding.edtEmail.error = "Email illegal"
                } else {
                    sendEmailAndSaveCode(email, code)
                }
            }
        }

        binding.confirmRecovery.setOnClickListener {
            val email = binding.edtEmail.text.toString().trim()
            val code = binding.edtcode.text.toString().trim()

            if(email == ""){
                binding.layoutEmail.error = "Email not blank"
            }else{
                if(!Patterns.EMAIL_ADDRESS.matcher(email).matches()){
                    binding.edtEmail.error = "Email is not illegal"
                }else{
                    if(code.length <6 || code.length >6){
                        binding.edtcode.error = "Code is 6 digits"
                    }else{
                        beginRecovery(email,code)
                    }
                }
            }
        }

        intenetViewModel = ViewModelProvider(this).get(IntenetViewModel::class.java)
        intenetViewModel.obseverLiveInternet.observe(this) {
            requestPermission(intenetViewModel.checkPermisstion())
            internetConnect = it
        }
    }
    private fun sendEmailAndSaveCode(email: String,code: String){
        if(internetConnect){
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val userInfoModel = Retrofit.getRetrofit().saveCodeRecovery(code, email)
                    if(userInfoModel == "no"){
                        binding.edtEmail.error = "Email is not exist!"
                    }else{
                        binding.layoutCode.isEnabled = true
                        binding.confirmRecovery.isEnabled = true
                        try {
                            Mailer.sendMail(
                                email,
                                "Forgot Password",
                                HtmlCompat.fromHtml(getString(R.string.recovery, code), HtmlCompat.FROM_HTML_MODE_LEGACY).toString()
                            )
                                .subscribeOn(Schedulers.io())
                                .observeOn(AndroidSchedulers.mainThread())
                                .subscribe(
                                    {
                                        Toast.makeText(
                                            this@RecoveryPassword,
                                            "Sending...",
                                            Toast.LENGTH_SHORT
                                        ).show()
                                    },{}
                                    )
                        }catch (e:Exception){
                            e.printStackTrace()
                        }
                    }
                }catch (e: SocketTimeoutException) {
                    runOnUiThread {
                        Toast.makeText(
                            this@RecoveryPassword,
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

    private fun beginRecovery(email: String, code: String) {
        if(internetConnect){
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val userInfoModel = Retrofit.getRetrofit().confirmCode(code,email)
                    if(userInfoModel == "no"){
                        binding.edtcode.error = "Code is incorrect!"
                    }else{
                        val intent = Intent(this@RecoveryPassword,CustomRecoveryPass::class.java)
                        intent.putExtra("email",email)
                        startActivity(intent)
                        finish()
                    }
                }catch (e: SocketTimeoutException) {
                    runOnUiThread {
                        Toast.makeText(
                            this@RecoveryPassword,
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