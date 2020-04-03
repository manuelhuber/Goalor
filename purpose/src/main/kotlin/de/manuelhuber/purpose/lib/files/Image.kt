package de.manuelhuber.purpose.lib.files

import java.io.File
import java.io.InputStream
import javax.imageio.IIOImage
import javax.imageio.ImageIO
import javax.imageio.ImageWriteParam
import javax.imageio.ImageWriter


fun writeCompressed(input: InputStream, outputPath: String, quality: Float, imageFormat: String): File {
    val image = ImageIO.read(input)
    val compressedImageFile = File(outputPath)
    val ios = ImageIO.createImageOutputStream(compressedImageFile)
    with(ios) {
        val writers = ImageIO.getImageWritersByFormatName(imageFormat)
        val writer = writers.next() as ImageWriter
        writer.output = ios

        val param = writer.defaultWriteParam
        param.compressionMode = ImageWriteParam.MODE_EXPLICIT
        param.compressionQuality = quality

        writer.write(null, IIOImage(image, null, null), param)
        writer.dispose()

        close()
    }
    return compressedImageFile
}
