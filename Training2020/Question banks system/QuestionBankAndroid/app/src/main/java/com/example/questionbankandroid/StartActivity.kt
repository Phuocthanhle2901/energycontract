package com.example.questionbankandroid

import android.Manifest
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.Settings
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.lifecycle.ViewModelProvider
import com.example.questionbankandroid.util.IntenetViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class StartActivity : AppCompatActivity() {
    private lateinit var intenetViewModel: IntenetViewModel
    private var internetConnect: Boolean = false
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_start)

        intenetViewModel = ViewModelProvider(this).get(IntenetViewModel::class.java)
        intenetViewModel.obseverLiveInternet.observe(this) {
            requestPermission(intenetViewModel.checkPermisstion())
            internetConnect = it
            CoroutineScope(Dispatchers.Main).launch{
                delay(3000)
                if(internetConnect){
                    startActivity(Intent(this@StartActivity,MainActivity::class.java))
                    finish()
                }else{
                    Toast.makeText(this@StartActivity, "No Access Internet", Toast.LENGTH_SHORT).show()
                }
            }
        }
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
                2220
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