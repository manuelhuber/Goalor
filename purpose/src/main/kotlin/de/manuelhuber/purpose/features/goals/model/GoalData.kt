package de.manuelhuber.purpose.features.aspects

data class GoalData(
        val title: String,
        val aspect: String,
        val parent: String?,
        val children: List<String>,
        val done: Boolean,
        val image: String?,
        val description: String?)
