package com.example.questionbankandroid.data


import com.squareup.moshi.Json

data class AnswerUserModel(
    @Json(name = "dapAnDung")
    val dapAnDung: Map<Int,String>,
    @Json(name = "dapAnUser")
    val dapAnUser: Map<String,String>,
    @Json(name = "diem")
    val diem: Int,
    @Json(name = "email")
    val email: String,
    @Json(name = "listCauHoi")
    val listCauHoi: List<QuestionModel>,
    @Json(name = "ngayLam")
    val ngayLam: String,
    @Json(name = "thoiGianLam")
    val thoiGianLam: Int,
    @Json(name = "tongDiem")
    val tongDiem: Int,
    @Json(name = "tongThoiGian")
    val tongThoiGian: Int,
    @Json(name = "dapAnTron")
    val dapAnTron:List<Map<String,String>>,
    @Json(name = "themeQuestion")
    val themeQuestion:String
)