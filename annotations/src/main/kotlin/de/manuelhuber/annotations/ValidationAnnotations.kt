package de.manuelhuber.annotations

@Retention(AnnotationRetention.SOURCE)
@Target(AnnotationTarget.FIELD)
/**
 * Used for inline classes of string values
 * String value can't be empty (after .trim())
 */
annotation class ValueNotEmpty

@Retention(AnnotationRetention.SOURCE)
@Target(AnnotationTarget.FIELD)
/**
 * String can't be empty (after .trim())
 */
annotation class NotEmpty

@Retention(AnnotationRetention.SOURCE)
@Target(AnnotationTarget.FIELD)
/**
 * String can't be empty (after .trim())
 */
annotation class MinLength(val len: Int)
