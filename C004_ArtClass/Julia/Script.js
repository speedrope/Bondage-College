var C004_ArtClass_Julia_CurrentStage = 0;
var C004_ArtClass_Julia_BigHugDone = false;
var C004_ArtClass_Julia_BigHugReady = false;
var C004_ArtClass_Julia_Sandro = true;
var C004_ArtClass_Julia_AllowUnderwear = false;
var C004_ArtClass_Julia_AllowNaked = false;
var C004_ArtClass_Julia_AllowShibari = false;
var C004_ArtClass_Julia_IsRestrained = false;
var C004_ArtClass_Julia_IsGagged = false;
var C004_ArtClass_Julia_TickleDone = false;
var C004_ArtClass_Julia_TightenDone = false;
var C004_ArtClass_Julia_CanBegForRelease = false;
var C004_ArtClass_Julia_EggConfirm = false;
var C004_ArtClass_Julia_EggInside = false;

// New image depending on Julia's bondage
function C004_ArtClass_Julia_GetImage() {
	if (C004_ArtClass_Julia_CurrentStage != 60) OveridenIntroImage = "";
	if ((C004_ArtClass_ArtRoom_JuliaStage == 5) && (C004_ArtClass_Julia_CurrentStage >= 150)) OveridenIntroImage = "JuliaRope.jpg";
	if ((C004_ArtClass_ArtRoom_JuliaStage == 6) && (C004_ArtClass_Julia_CurrentStage >= 150)) OveridenIntroImage = "JuliaRopeBallgag.jpg";
	if ((C004_ArtClass_ArtRoom_JuliaStage == 7) && (C004_ArtClass_Julia_CurrentStage >= 150)) OveridenIntroImage = "JuliaRopeTapeGag.jpg";
}

// Chapter 4 - Julia Load
function C004_ArtClass_Julia_Load() {

	// Set the timer limits at 10:15
	StartTimer(10.25 * 60 * 60 * 1000, "C004_ArtClass", "Outro");

	// Load the scene parameters
	ActorLoad("Julia", "ArtRoom");
	LoadInteractions();
	C004_ArtClass_Julia_EggConfirm = false;

	// Julia progression
	if (C004_ArtClass_Julia_CurrentStage == 100) C004_ArtClass_Julia_CurrentStage = 110;
	if (C004_ArtClass_Julia_CurrentStage == 130) C004_ArtClass_Julia_CurrentStage = 140;
	if ((C004_ArtClass_Julia_CurrentStage == 160) || (C004_ArtClass_Julia_CurrentStage == 180)) C004_ArtClass_Julia_CurrentStage = 170;
	C004_ArtClass_Julia_Sandro = ((C004_ArtClass_ArtRoom_JuliaStage >= 1) && Common_PlayerNotGagged);	
	C004_ArtClass_Julia_AllowUnderwear = ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && Common_PlayerNotGagged && Common_PlayerClothed);
	C004_ArtClass_Julia_AllowNaked = ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && Common_PlayerNotGagged && Common_PlayerUnderwear);
	C004_ArtClass_Julia_GetImage();
	
	// When the talk is over, allow the player to leave
	if (C004_ArtClass_Julia_CurrentStage >= 60) LeaveIcon = "Leave";
	else LeaveIcon = "";	
	C004_ArtClass_Julia_BigHugReady = (!C004_ArtClass_Julia_BigHugDone && Common_PlayerNotGagged && (C004_ArtClass_Julia_CurrentStage >= 60));
	C004_ArtClass_Julia_AllowShibari = ((Common_BondageAllowed == false) && (C004_ArtClass_ArtRoom_JuliaStage >= 4));
	
	// If we allow the player to beg to be released
	C004_ArtClass_Julia_CanBegForRelease = ((C004_ArtClass_ArtRoom_ExtraModel == "Player") && Common_PlayerRestrained && Common_PlayerGagged);

}

// Chapter 4 - Julia Run
function C004_ArtClass_Julia_Run() {
	BuildInteraction(C004_ArtClass_Julia_CurrentStage);
}

// Chapter 4 - Julia Click
function C004_ArtClass_Julia_Click() {	

	// Regular interactions
	ClickInteraction(C004_ArtClass_Julia_CurrentStage);
	var ClickInv = GetClickedInventory();
	
	// When the talk is over, allow the player to leave
	if (C004_ArtClass_Julia_CurrentStage >= 60) LeaveIcon = "Leave";

	// When the user wants to use any item and bondage isn't allowed
	if (!Common_BondageAllowed && ((ClickInv == "Rope") || (ClickInv == "Ballgag") || (ClickInv == "TapeGag") || (ClickInv == "Crop") || (ClickInv == "Cuffs") || (ClickInv == "VibratingEgg")) && Common_PlayerNotRestrained)
		OveridenIntroText = "What are you doing new pupil?|Put this away and get your brush.";

	// When the user wants to use the rope on Julia
	if (Common_BondageAllowed && (ClickInv == "Rope") && !ActorHasInventory("Rope") && Common_PlayerNotRestrained) {
	
		// It can work if Julia is submissive, else the player gets tied up
		if (ActorGetValue(ActorSubmission) > 0) {
			OveridenIntroText = "(You circle the rope around her curvy body,|making tight knots.)  Now this is art!";
			C004_ArtClass_Julia_CurrentStage = 170;
			C004_ArtClass_ArtRoom_JuliaStage = 5;
			C004_ArtClass_Julia_IsRestrained = true;
			ActorAddInventory("Rope");
		} else {
			if (Common_PlayerNaked) OveridenIntroText = "Si!  It's time to use these ropes.|(She grabs your arms and restrains you tightly.)";
			else OveridenIntroText = "Si!  It's time to tie you up. (She strips|you, grabs the ropes and restrains you tightly.)";
			PlayerClothes("Naked");
			PlayerLockInventory("Rope");
			PlayerRemoveInventory("Rope", 1);
		}

		// Time and item are consumed
		PlayerRemoveInventory("Rope", 1);
		CurrentTime = CurrentTime + 60000;		
	}

	// When the user wants to use the ballgag
	if (Common_BondageAllowed && (ClickInv == "Ballgag") && (C004_ArtClass_ArtRoom_JuliaStage >= 5) && !ActorHasInventory("Ballgag") && Common_PlayerNotRestrained) {
		OveridenIntroText = "(She shakes her head negatively but cannot|resist as you push the ballgag in her mouth.)";
		C004_ArtClass_Julia_CurrentStage = 170;
		C004_ArtClass_Julia_Ungag();
		C004_ArtClass_ArtRoom_JuliaStage = 6;
		ActorAddInventory("Ballgag");
		PlayerRemoveInventory("Ballgag", 1);
		C004_ArtClass_Julia_IsGagged = true;
		CurrentTime = CurrentTime + 60000;
	}

	// When the user wants to use the tape gag
	if (Common_BondageAllowed && (ClickInv == "TapeGag") && (C004_ArtClass_ArtRoom_JuliaStage >= 5) && !ActorHasInventory("TapeGag") && Common_PlayerNotRestrained) {
		OveridenIntroText = "(She shakes her head negatively but cannot|do much as you apply tape on her mouth.)";
		C004_ArtClass_Julia_CurrentStage = 170;
		C004_ArtClass_Julia_Ungag();
		C004_ArtClass_ArtRoom_JuliaStage = 7;
		ActorAddInventory("TapeGag");
		PlayerRemoveInventory("TapeGag", 1);
		C004_ArtClass_Julia_IsGagged = true;
		CurrentTime = CurrentTime + 60000;
	}
	
	// When the user wants to use the crop
	if (Common_BondageAllowed && (ClickInv == "Crop") && ActorHasInventory("Rope") && Common_PlayerNotRestrained) {
		OveridenIntroText = "(You whip her with the crop a few times.|She doesn't seem to be in too much pain.)";
		CurrentTime = CurrentTime + 60000;
	}

	// When the user wants to use the vibrating egg on Julia
	if (Common_BondageAllowed && (ClickInv == "VibratingEgg") && !ActorHasInventory("VibratingEgg") && ActorHasInventory("Rope") && Common_PlayerNotRestrained) {		
		if (C004_ArtClass_Julia_EggConfirm == false) {
			C004_ArtClass_Julia_EggConfirm = true;
			OveridenIntroText = "(You might not be able to recover the egg if|you insert it in Julia, click on it again to do it.)";
		} else {
			ActorAddInventory("VibratingEgg");
			PlayerRemoveInventory("VibratingEgg", 1);
			OveridenIntroText = "(You pull on the rope and slide the egg in|very easily, you're not even sure she noticed.)";
			C004_ArtClass_Julia_EggInside = true;
		}
	}
	
	// Get the correct image for Julia
	C004_ArtClass_Julia_GetImage();
	
}

// Chapter 4 - Julia Big Hug
function C004_ArtClass_Julia_BigHug() {
	if (C004_ArtClass_Julia_BigHugDone == false) {
		C004_ArtClass_Julia_BigHugDone = true;
		ActorChangeAttitude(1, 0);
		C004_ArtClass_Julia_BigHugReady = false;
		OveridenIntroImage = "JuliaHug.jpg";
	}
}

// Chapter 4 - Julia Remove Top
function C004_ArtClass_Julia_RemoveTop() {
	if (C004_ArtClass_ArtRoom_JuliaStage <= 1) 
		C004_ArtClass_ArtRoom_JuliaStage = 2;
}

// Chapter 4 - Julia Strip
function C004_ArtClass_Julia_Strip() {
	if (C004_ArtClass_ArtRoom_JuliaStage <= 2) 
		C004_ArtClass_ArtRoom_JuliaStage = 3;
}

// Chapter 4 - Julia Query New Model
function C004_ArtClass_Julia_QueryNewModel() {
	if (ActorGetValue(ActorSubmission) <= 0) {
		OveridenIntroText = "I agree, a shy new pupil will be a great model.|(She grabs your arm and pulls you in front.)";
		ActorChangeAttitude(0, -1);
		C004_ArtClass_Julia_CurrentStage = 160;
		C004_ArtClass_ArtRoom_ExtraModel = "Player";
		PlayerClothes("Clothed");
	}
}

// Chapter 4 - Julia Recover all inventory from an actor (except the egg)
function C004_ArtClass_Julia_RecoverInventory(ActorToRecover) {
	CurrentActor = ActorToRecover;
	if (ActorHasInventory("Ballgag")) { PlayerAddInventory("Ballgag", 1); ActorRemoveInventory("Ballgag"); }
	if (ActorHasInventory("Rope")) { PlayerAddInventory("Rope", 1); ActorRemoveInventory("Rope"); }
	ActorRemoveInventory("TapeGag");
}

// Chapter 4 - Julia Change Model
function C004_ArtClass_Julia_NewModel(ModelName) {

	// Reset Sarah model
	C004_ArtClass_ArtRoom_SarahStage = 0;
	if (C004_ArtClass_Sarah_CurrentStage > 130) C004_ArtClass_Sarah_CurrentStage = 130;
	C004_ArtClass_Julia_RecoverInventory("Sarah");

	// Reset Jennifer model
	C004_ArtClass_ArtRoom_JenniferStage = 0;
	if (C004_ArtClass_Jennifer_CurrentStage > 100) C004_ArtClass_Jennifer_CurrentStage = 100;
	C004_ArtClass_Julia_RecoverInventory("Jennifer");

	// Set the new model
	CurrentActor = "Julia";
	C004_ArtClass_ArtRoom_ExtraModel = ModelName;
	PlayerClothes("Clothed");
	if (C004_ArtClass_Julia_IsGagged) OveridenIntroText = "(She nods and the new model steps in.)";

}

// Chapter 4 - Julia Player Remove Outfit
function C004_ArtClass_Julia_PlayerRemoveOutfit() {
	PlayerClothes("Underwear");
	if (C004_ArtClass_Julia_IsGagged) OveridenIntroText = "(She nods and you remove your outfit.)";
}

// Chapter 4 - Julia Player Strip
function C004_ArtClass_Julia_PlayerStrip() {
	PlayerClothes("Naked");
	if (C004_ArtClass_Julia_IsGagged) OveridenIntroText = "(She nods and you fully strip.)";
}

// Chapter 4 - Julia Shibari Start
function C004_ArtClass_Julia_ShibariStart() {
	Common_BondageAllowed = true;
	C004_ArtClass_Julia_AllowShibari = false;
	PlayerAddInventory("Rope", 2);
}

// Chapter 4 - Julia Ungag
function C004_ArtClass_Julia_Ungag() {
	if (ActorHasInventory("Ballgag")) {
		PlayerAddInventory("Ballgag", 1);
		ActorRemoveInventory("Ballgag");
	}
	ActorRemoveInventory("TapeGag");
	C004_ArtClass_Julia_IsGagged = false;
	C004_ArtClass_ArtRoom_JuliaStage = 5;
}

// Chapter 4 - Julia Try Ungag
function C004_ArtClass_Julia_TryUngag() {
	if (Common_PlayerNotRestrained) C004_ArtClass_Julia_Ungag();
	else OveridenIntroText = "(You try to ungag Julia but fail|miserably as the other students giggle.)";
}

// Chapter 4 - Julia Release
function C004_ArtClass_Julia_Release() {
	if (Common_PlayerNotRestrained) {
		C004_ArtClass_Julia_IsRestrained = false;
		PlayerAddInventory("Rope", 1);
		ActorRemoveInventory("Rope");
		C004_ArtClass_Julia_Ungag();
		C004_ArtClass_ArtRoom_JuliaStage = 4;
	} else {
		OveridenIntroText = "(You try to untie Julia but fail|miserably as the other students giggle.)";
	}
}

// Chapter 4 - Julia Tighten
function C004_ArtClass_Julia_Tighten() {
	if (Common_PlayerNotRestrained) {
		if (C004_ArtClass_Julia_TightenDone == false) {
			if (C004_ArtClass_Julia_IsGagged) OveridenIntroText = "(You tighten the knots while she struggles.)|MMNRGN NOG! (She seems to endure the pain.)";
			else OveridenIntroText = "(You tighten the knots while she struggles.)|Dio mio!  This is really tight new pupil.";
			ActorChangeAttitude(0, 1);
			C004_ArtClass_Julia_TightenDone = true;
		}
	} else {
		OveridenIntroText = "(You try to tighten Julia's bondage|but fail as the other students giggle.)";
	}
}

// Chapter 4 - Julia Tickle
function C004_ArtClass_Julia_Tickle() {
	if (C004_ArtClass_Julia_TickleDone == false) {
		if (Common_PlayerNotRestrained) OveridenIntroText = "(You tickle her in front of the class.|She laughs loudly and seems to enjoy it.)";
		else OveridenIntroText = "(You fumble a little but manage to tickle her.|She laughs loudly and seems to enjoy it.)";
		ActorChangeAttitude(1, 0);
		C004_ArtClass_Julia_TickleDone = true;
	}	
}

// Chapter 4 - Julia Change Model
function C004_ArtClass_Julia_ChangeModel() {
	if (C004_ArtClass_Julia_IsGagged) OveridenIntroText = "(She nods and looks around.)"
}

// Chapter 4 - Julia Beg For Release
function C004_ArtClass_Julia_BegForRelease() {
	if (!C004_ArtClass_Julia_IsRestrained) {
		if (ActorGetValue(ActorLove) >= 3) {
			OveridenIntroText = "Oh!  Why are you gagged poor new pupil?|(She releases you from the gag and smiles.)";
			if (PlayerHasLockedInventory("Ballgag")) PlayerAddInventory("Ballgag", 1);
			PlayerUnlockInventory("Ballgag");
			PlayerUnlockInventory("TapeGag");
			C004_ArtClass_Julia_CanBegForRelease = false;
			CurrentTime = CurrentTime + 60000;
		} else {
			OveridenIntroText = "Someone gagged you?  Cute!  Art is chaos!|(You need 3 love or more to be ungagged by her.)";
		}		
	} else {
		OveridenIntroText = "(She tugs on her ropes, it seems|she won't be able to help you much.)";
	}	
}

// Chapter 4 - Julia Beg For Release
function C004_ArtClass_Julia_GaggedSpeach() {
	if ((C004_ArtClass_ArtRoom_JuliaStage == 6) || (C004_ArtClass_ArtRoom_JuliaStage == 7))
		OveridenIntroText = "Eep ah hoze eew wuwii!";
}