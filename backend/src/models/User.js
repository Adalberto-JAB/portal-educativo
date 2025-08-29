import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, introduzca una dirección de correo electrónico válida']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.'],
        // La longitud mínima de 6 caracteres está incluida en la expresión regular
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            'La contraseña debe tener al menos 6 caracteres y contener una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).'
        ]
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'], 
        default: 'student'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    profilePictureURL: {
        type: String,
        default: ''
    }
}, {
    timestamps: true // Agrega las marcas de tiempo createdAt y updatedAt
});

// Hashea la contraseña antes de guardar el usuario
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
