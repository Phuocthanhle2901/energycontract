package com.example.questionbankandroid.service


import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory


class Retrofit {
    companion object {
        private val moshi = Moshi.Builder()
            .add(KotlinJsonAdapterFactory())
            .build()
        fun  getRetrofit() :APIService {
             return Retrofit.Builder()
                    .baseUrl("http://192.168.137.1:5000/api/")
                    .addConverterFactory(MoshiConverterFactory.create(moshi))
                    .build()
                    .create(APIService::class.java)
        }

    }
}