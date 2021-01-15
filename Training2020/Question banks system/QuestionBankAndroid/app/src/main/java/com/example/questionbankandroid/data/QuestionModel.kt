package com.example.questionbankandroid.data


import com.squareup.moshi.Json

data class QuestionModel(
    @Json(name = "answer")
    val answer: List<String>,
    @Json(name = "id")
    val id: String,
    @Json(name = "level")
    val level: Int,
    @Json(name = "point")
    val point: Int,
    @Json(name = "question")
    val question: String,
    @Json(name = "status")
    val status: Boolean,
    @Json(name = "themeName")
    val themeName: String,
    @Json(name = "timeallow")
    val timeallow: Int,
    @Json(name = "trueAnswer")
    val trueAnswer: String
)