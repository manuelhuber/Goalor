import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.Model
import java.util.*

data class Gratitude(override val id: Id,
                     val title: String,
                     val description: String,
                     val date: Date,
                     val imageUrl: String?) : Model
