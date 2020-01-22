package de.manuelhuber.purpose.features.gratitude.model

import de.manuelhuber.purpose.features.gratitude.GratitudeData
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.OwnedModel
import java.time.LocalDate

data class Gratitude(override val id: Id,
                     override val owner: Id,
                     val title: String,
                     val date: LocalDate,
                     val description: String?,
                     val image: String?) : OwnedModel {
    companion object {
        fun fromData(data: GratitudeData, owner: Id, imageId: String?): Gratitude {
            return Gratitude(Id(""), owner, data.title, data.date, data.description, imageId)
        }
    }
}
