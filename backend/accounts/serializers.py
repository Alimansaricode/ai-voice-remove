
from pathlib import Path

from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers

from audio.models import AudioFile

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user



class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            user = User.objects.get(email__iexact=attrs["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        user = authenticate(
            username=user.username,
            password=attrs["password"],
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        attrs["user"] = user
        return attrs



class AudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = [
            "id",
            "original_file",
            "cleaned_file",
            "created_at",
        ]
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

        if file.size > 50 * 1024 * 1024:
            raise serializers.ValidationError(
                "File size must be 50 MB or less."
            )

        return file

    def validate_cleaned_file(self, file):
        allowed_extensions = {
            ".wav", ".mp3", ".webm", ".ogg", ".m4a"
        }

        if Path(file.name).suffix.lower() not in allowed_extensions:
            raise serializers.ValidationError(
                "Unsupported cleaned audio format."
            )

        if file.size > 50 * 1024 * 1024:
            raise serializers.ValidationError(
                "Cleaned audio must be 50 MB or less."
            )

        return file
