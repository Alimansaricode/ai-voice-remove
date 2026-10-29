
from django.conf import settings
from django.db import models


class AudioFile(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="audio_files",
        null=True,
        blank=True,
    )
    original_file = models.FileField(upload_to="uploads/")
    cleaned_file = models.FileField(
        upload_to="cleaned/",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.original_file.name
