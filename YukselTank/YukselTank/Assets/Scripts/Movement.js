#pragma strict

//Multipliers
public var SpeedMult : float = 1.0f;

//PlayerInfo
public var Health : float;
public var FireRate : float = 0.33f;
private var FireTimePass : float = 0.00f;

//Array of bullets that the tank can shoot
public var Bullets : Transform[];

public var Turret : Transform;
public var BulletSpawn : Transform;
public var BulletSpawnLeft : Transform;
public var BulletSpawnRight : Transform;


//Powerups
private var bStartPowerUp : boolean = false;
private var PowerUpDur : float = 5.0f;
private var PowerUpTimer : float = 0.0f;
public var bMultiShotEnabled : boolean = false;

//Finders variables
public var FeelerDistance : float = 2.0f;
public var FrontHit : float = -1f;
public var RightHit : float = -1f;
public var LeftHit : float = -1f;
public var distanceToObstacle : float = -1f;

public var hit : RaycastHit;

function Start () 
{

}

function Update () {

	FireTimePass += Time.deltaTime;

	if(bStartPowerUp)
	{
		PowerUpTimer += Time.deltaTime;
		if(PowerUpTimer >= PowerUpDur)
		{
			bStartPowerUp = false;
			PowerUpTimer = 0.0f;
			bMultiShotEnabled = false;
		}
	}

	Movement();
	
	Finders();
	

}


function Finders()
{
	// Other two rayCasts
	var leftRay = transform.position + Vector3(-0.125, 0, 0);
    var rightRay = transform.position + Vector3(0.125, 0, 0);
    
     
    
    var p1 : Vector3 = transform.position;// + charCtrl.center;
    // Cast a sphere wrapping character controller 10 meters forward, to see if it is about to hit anything
    if (Physics.SphereCast (p1, transform.localScale.y / 2, transform.forward, hit, FeelerDistance)) {
        distanceToObstacle = hit.distance;
        Debug.DrawLine(transform.position, hit.point, Color.white);
    }
    
    
    
    /*
	
	if(Physics.Raycast(transform.position, transform.forward, hit, FeelerDistance)){
	
		
        Debug.DrawLine (transform.position, hit.point, Color.white);
		FrontHit = hit.distance;	
		print("Hello");
	
	}
	
	
	
	if(Physics.Raycast(leftRay, transform.forward, hit, FeelerDistance)){
	
         Debug.DrawLine (leftRay, hit.point, Color.red);
 
         
         
		LeftHit = hit.distance;
	}
	
	if(Physics.Raycast(rightRay, transform.forward, hit, FeelerDistance)){
	
         Debug.DrawLine (rightRay, hit.point, Color.green);
 
         
         
		RightHit = hit.distance;
	
	}
	/*
	function Update () 
	{
    	var hit : RaycastHit;
    	if (Physics.Raycast (transform.position, -Vector3.up, hit, 100.0))
    	{
        	var distanceToGround = hit.distance;
    	}
	}
	*/
	
	
	
	
	
	
}

function Movement()
{

	transform.eulerAngles.x=0;
	//forwards
	if(Input.GetKey(KeyCode.W))
	{
		
		
		
		transform.Translate((Vector3.forward * Time.deltaTime) * SpeedMult);
	}
	//backwards
	if(Input.GetKey(KeyCode.S))
	{
		transform.Translate((-Vector3.forward * Time.deltaTime) * SpeedMult);
	}	
	if(Input.GetKey(KeyCode.A))
	{
		if(Input.GetKey(KeyCode.S))
			transform.Rotate(Vector3.up * Time.deltaTime*50);
		else
			transform.Rotate(-Vector3.up * Time.deltaTime*50);
	}
	if(Input.GetKey(KeyCode.D))
	{
		if(Input.GetKey(KeyCode.S))
			transform.Rotate(-Vector3.up * Time.deltaTime*50);
		else
			transform.Rotate(Vector3.up * Time.deltaTime*50);
	}
	
	//TURRT ROTATION
	if(Input.GetKey(KeyCode.Q))
	{
		Turret.Rotate(-Vector3.up * Time.deltaTime*100);
	}
	if(Input.GetKey(KeyCode.E))
	{
		Turret.Rotate(Vector3.up * Time.deltaTime*100);
	}
	
	if(Input.GetKeyDown(KeyCode.Space) && (FireTimePass >= FireRate))
	{
		FireTimePass = 0;
		Instantiate(Bullets[0], BulletSpawn.position, BulletSpawn.rotation);
	
		if(bMultiShotEnabled)
		{
			Instantiate(Bullets[0], BulletSpawnLeft.position, BulletSpawnLeft.rotation);
			Instantiate(Bullets[0], BulletSpawnRight.position, BulletSpawnRight.rotation);
		}
	
	}
	
	
}


function OnTriggerEnter(other : Collider) 
{
	print(other.gameObject.name);
	if(other.gameObject.tag == "PowerUp")
	{
		print("GOT POWER UP");
		
		bStartPowerUp = true;
		PowerUpDur = 10.0f;
		bMultiShotEnabled = true;
		
		Destroy(other.gameObject);
	}
    
}
