import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/env.dev';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileDialogComponent } from './components/edit-profile-dialog/edit-profile-dialog.component';
import { HomeComponent } from './pages/home/home.component';
import { NewPostDialogComponent } from './components/new-post-dialog/new-post-dialog.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { PostComponent } from './pages/post/post.component';
import { LikesModalComponent } from './components/likes-modal/likes-modal.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MessageComponent } from './components/message/message.component';
import { ConversationsComponent } from './pages/conversations/conversations.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    ProfileComponent,
    EditProfileDialogComponent,
    HomeComponent,
    NewPostDialogComponent,
    PostCardComponent,
    RelativeDatePipe,
    PostComponent,
    LikesModalComponent,
    NotFoundComponent,
    MessageComponent,
    ConversationsComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
