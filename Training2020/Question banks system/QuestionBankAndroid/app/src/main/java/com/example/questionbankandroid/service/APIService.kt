package com.example.questionbankandroid.service

import com.example.questionbankandroid.data.AnswerUserModel
import com.example.questionbankandroid.data.QuestionModel
import com.example.questionbankandroid.data.ThemeQuestionModel
import com.example.questionbankandroid.data.UserInfoModel
import com.squareup.moshi.Json
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.http.*

interface APIService {
    @GET("ThemeQuestion/android/getAllTheme")
    suspend fun getThemeQuestion(): List<ThemeQuestionModel>

    //Login post email and password
    @POST("UserInfo/android/login")
    suspend fun login(@Query("email") email:String, @Query("pass") pass:String) : UserInfoModel


    //save code
    @PUT("UserInfo/android/login/savecode")
    suspend fun saveCodeRecovery(@Query("code") code:String, @Query("email") email:String):String

    //confirm code
    @POST("UserInfo/android/login/confirmcode")
    suspend fun confirmCode(@Query("code") code:String, @Query("email") email:String):String

    //Thay doi mat khau
    @PUT("UserInfo/android/login/changpassword")
    suspend fun changePassword(@Query("email") email:String, @Query("pass") pass: String):UserInfoModel

    @POST("UserInfo/android/confirmAccount")
    suspend fun confirmAccount(@Query("email") email:String,@Query("pass") pass:String):String

    @POST("UserInfo/android/register")
    suspend fun register(@Query("email") email:String, @Query("pass") pass: String, @Query("fullname") fullname:String):UserInfoModel

    @GET("Question/android/all")
    suspend fun getAllQuestion(@Query("theme") theme:String):List<QuestionModel>

    @GET("Question/android/all/question")
    suspend fun getAllQuestion():List<QuestionModel>

    @DELETE("Question/android/delete")
    suspend fun deleteQuestion(@Query("id") id:String)

    @POST("Question/android/uploadQuestion")
    suspend fun uploadQuestions(@Body question:QuestionModel):String

    @POST(value = "AnswerUser/android/create")
    fun createAnswerUser(@Body answerUserModel: AnswerUserModel):Call<AnswerUserModel>

    //get answer user
    @GET("AnswerUser/android/getItem")
    suspend fun getAnswerUser(@Query("email") email:String,@Query("ngaylam") ngaylam:String):AnswerUserModel

    @GET("AnswerUser/android/getAllAnswer")
    suspend fun getAllAnswerUser(@Query("email") email: String):List<AnswerUserModel>
}