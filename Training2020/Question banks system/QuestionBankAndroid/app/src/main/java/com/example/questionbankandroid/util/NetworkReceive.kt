package com.example.questionbankandroid.util

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class NetworkReceive(private val mainViewModel: IntenetViewModel) : BroadcastReceiver() {

    companion object{
        private val TAG :String ="CKN"
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        Log.d(TAG,"onReceive($context,$intent")
        if(intent?.action  == "android.net.conn.CONNECTIVITY_CHANGE")
            mainViewModel.checkConnections()
    }
}