package com.example.questionbankandroid.service

import com.example.questionbankandroid.data.AnswerUserModel
import com.example.questionbankandroid.data.QuestionModel
import com.example.questionbankandroid.data.ThemeQuestionModel
import com.example.questionbankandroid.data.UserInfoModel
import com.squareup.moshi.Json
import retrofit2.Call
import retrofit2.http.*

interface APIService {
    @GET("ThemeQuestion/android/getAllTheme")
    suspend fun getThemeQuestion(): List<ThemeQuestionModel>

    //Login post email and password
    @POST("UserInfo/android/login")
    suspend fun login(@Query("email") email:String, @Query("pass") pass:String) : UserInfoModel?

    //save code
    @PUT("UserInfo/android/login/savecode")
    suspend fun saveCodeRecovery(@Query("code") code:String, @Query("email") email:String):String

    //confirm code
    @POST("UserInfo/android/login/confirmcode")
    suspend fun confirmCode(@Query("code") code:String, @Query("email") email:String):String

    //Thay doi mat khau
    @PUT("UserInfo/android/login/changpassword")
    suspend fun changePassword(@Query("email") email:String, @Query("pass") pass: String):UserInfoModel?

    @POST("UserInfo/android/register")
    suspend fun register(@Query("email") email:String, @Query("pass") pass: String, @Query("fullname") fullname:String):UserInfoModel?

    @GET("Question/android/all")
    fun getAllQuestion(@Query("theme") theme:String):Call<List<QuestionModel>>

    @POST(value = "AnswerUser/android/create")
    fun createAnswerUser(@Body answerUserModel: AnswerUserModel):Call<AnswerUserModel>

    //get answer user
    @GET("AnswerUser/android/getItem")
    fun getAnswerUser(@Query("email") email:String,@Query("ngaylam") ngaylam:String):Call<AnswerUserModel>
}