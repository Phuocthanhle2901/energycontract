package com.example.questionbankandroid.data


import com.squareup.moshi.Json

data class UserInfoModel(
    @Json(name = "avatar")
    val avatar: String?,
    @Json(name = "email")
    val email: String?,
    @Json(name = "fullname")
    val fullname: String?,
    @Json(name = "id")
    val id: String?,
    @Json(name = "password")
    val password: String?,
    @Json(name = "resetPasswordlink")
    val resetPasswordlink: String?,
    @Json(name = "role")
    val role: Int?,
    @Json(name = "status")
    val status: Boolean?
)