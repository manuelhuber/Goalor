package de.manuelhuber.purpose.features.goals.model

import de.manuelhuber.purpose.lib.engine.Id

data class GoalData(
        val title: String,
        val aspect: String,
        val parent: Id?,
        val children: List<Id>,
        val done: Boolean,
        val image: String?,
        val description: String?)
