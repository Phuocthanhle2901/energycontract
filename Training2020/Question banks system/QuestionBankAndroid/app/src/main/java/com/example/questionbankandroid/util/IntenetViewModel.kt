package com.example.questionbankandroid.util

import android.Manifest
import android.app.Application
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.os.Build
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.example.questionbankandroid.LoginActivity
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.data.UserInfoModel
import com.example.questionbankandroid.service.Retrofit
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.IOException

class IntenetViewModel(application: Application) : AndroidViewModel(application) {
    companion object {
        private val TAG: String = "CKNInternet"
    }

    private val connectivityManager: ConnectivityManager =
        getApplication<Application>().getSystemService(
            Context.CONNECTIVITY_SERVICE
        ) as ConnectivityManager
    private lateinit var networkCallback: ConnectivityManager.NetworkCallback
    private val networkReceiver: NetworkReceive = NetworkReceive(this)

    //Live data
    private val _liveInternet: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
    val obseverLiveInternet: LiveData<Boolean>
        get() = _liveInternet
    private val _livePing: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
    val obseverLivePing: LiveData<Boolean>
        get() = _livePing
    private val _liveMeter: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
    val obseverLiveMeter: LiveData<Boolean>
        get() = _liveMeter

    //Dang ki Internet
    fun registerConnectivity() {
        // >=24
        setNetworkCallBack()
        connectivityManager.registerDefaultNetworkCallback(networkCallback)

    }

    //Huy dang ki Internet
    fun unRegisterConnectivity() {
        connectivityManager.unregisterNetworkCallback(networkCallback)
    }

    private fun setNetworkCallBack() {
        Log.d(TAG, "setNetworkCallback()")
        networkCallback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                Log.d(TAG, "onAvailable($network)")
                super.onAvailable(network)
                checkConnections()
            }

            override fun onUnavailable() {
                Log.d(TAG, "onUnavailable")
                super.onUnavailable()
                checkConnections()
            }

            override fun onLost(network: Network) {
                Log.d(TAG, "onLost($network)")
                super.onLost(network)
                checkConnections()
            }

            override fun onCapabilitiesChanged(
                network: Network,
                networkCapabilities: NetworkCapabilities
            ) {
                super.onCapabilitiesChanged(network, networkCapabilities)
                if (networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_NOT_METERED)) {
                    Log.d(TAG, "Sever High Quality Content")
                    _liveMeter.postValue(true)
                } else {
                    Log.d(TAG, "Sever Lower Quality Content")
                    _liveMeter.postValue(false)
                }
            }
        }
    }

    private fun setNetworkRequest(): NetworkRequest {
        Log.d(TAG, "setNetworkRequest()")
        return NetworkRequest.Builder()
            .addTransportType(NetworkCapabilities.TRANSPORT_CELLULAR)
            .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
            .build()
    }

    //Check connection
    fun checkConnections() {
        _liveInternet.postValue(hasInternet())
        _livePing.postValue(pingGoogle())
    }

    private fun pingGoogle(): Boolean {
        Log.d(TAG, "pingGoogle()")
        val command = "ping -c 1 google.com"
        return try {
            Runtime.getRuntime().exec(command).waitFor() == 0
        } catch (e: IOException) {
            e.printStackTrace()
            false
        } catch (e: InterruptedException) {
            e.printStackTrace()
            false
        }
    }

    private fun hasInternet(): Boolean {
        Log.d(TAG, "hasInternet()")
        var hasWifi = false
        var hasMoblieData = false

        val activeNetwork = connectivityManager.activeNetwork

        if (activeNetwork != null) {
            val networkCapabilities = connectivityManager.getNetworkCapabilities(activeNetwork)
            networkCapabilities?.run {
                if (hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                    hasWifi = true
                }
                if (hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
                    hasMoblieData = true
                }
            }
        }

        return hasWifi || hasMoblieData
    }

    //Xin quyen
    fun checkPermisstion(): Boolean {
        var value = false
        Log.d(TAG, "checkPermission()")
        if (isInternetPermissionGranted()) {
            Log.d(TAG, "isInternetPermissionGranted()")
            value = true
        }
        if (isAccessWifiStatePermissionGranted()) {
            Log.d(TAG, "isAccessWifiStatePermissionGranted()")
            value = true
        }
        if (isAccessNetworkStatePermissionGranted()) {
            Log.d(TAG, "isAccessNetworkStatePermissionGranted()")
            value = true
        }
        return value
    }

    private fun isInternetPermissionGranted(): Boolean = ActivityCompat.checkSelfPermission(
        getApplication(),
        Manifest.permission.INTERNET
    ) == PackageManager.PERMISSION_GRANTED

    private fun isAccessWifiStatePermissionGranted(): Boolean = ActivityCompat.checkSelfPermission(
        getApplication(),
        Manifest.permission.ACCESS_WIFI_STATE
    ) == PackageManager.PERMISSION_GRANTED

    private fun isAccessNetworkStatePermissionGranted(): Boolean =
        ActivityCompat.checkSelfPermission(
            getApplication(),
            Manifest.permission.ACCESS_NETWORK_STATE
        ) == PackageManager.PERMISSION_GRANTED


}