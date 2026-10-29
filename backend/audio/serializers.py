from pathlib import Path

from rest_framework import serializers
from .models import AudioFile


class AudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = ["id", "original_file", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_original_file(self, file):
        allowed_extensions = {
            ".wav", ".mp3", ".webm", ".ogg", ".m4a", ".mp4"
        }

        extension = Path(file.name).suffix.lower()

        if extension not in allowed_extensions:
            raise serializers.ValidationError(
                "Unsupported audio/video file format."
            )

        max_size = 50 * 1024 * 1024

        if file.size > max_size:
            raise serializers.ValidationError(
                "File size must be 50 MB or less."
            )

        return file