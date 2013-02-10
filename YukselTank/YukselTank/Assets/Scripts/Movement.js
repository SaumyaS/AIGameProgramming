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
public var FeelerDistance : float = 4.0f;
public var FrontHit : float = -1f;
public var RightHit : float = -1f;
public var LeftHit : float = -1f;

//constants
public var HIT_MASK : int = 0;
public var IGNORE_LAYER : int = 2;

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
	var leftRay = Quaternion.Euler(0, -30, 0) * transform.forward;
    var rightRay = Quaternion.Euler(0, 30, 0) * transform.forward;
    
    
     
    
    
    
	
	if(Physics.Raycast(transform.position, transform.forward, hit, FeelerDistance)){
	
		
        Debug.DrawLine (transform.position, hit.point, Color.white);
		FrontHit = hit.distance;	
		//print("Hello");
	
	}
	
	
	
	if(Physics.Raycast(transform.position, leftRay, hit, FeelerDistance)){
	
         Debug.DrawLine (transform.position, hit.point, Color.red);
 
         
         
		LeftHit = hit.distance;
	}
	
	if(Physics.Raycast(transform.position, rightRay, hit, FeelerDistance)){
	
         Debug.DrawLine (transform.position, hit.point, Color.green);
 
         
         
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
	transform.eulerAngles.z=0;
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
		Turret.Rotate(-Vector3.up * Time.deltaTime*50);
	}
	if(Input.GetKey(KeyCode.E))
	{
		Turret.Rotate(Vector3.up * Time.deltaTime*50);
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
	
	var Colliders : Collider[];
	//Get all objects withing a radius
	Colliders = Physics.OverlapSphere(transform.position, 4, 1);
	//Iterate through each object found
	for(var i : int = 0; i<Colliders.length; i++)
	{
		var otherObject : GameObject = Colliders[i].gameObject; 
		// Is the object an EnemyTank?
		if( otherObject.tag == "EnemyTank")
		{
			var hitInfo : RaycastHit;
			var layerMask : int = 1 << HIT_MASK;
			//Linecast from playerTank to EnemyTank. Only cast on objects in layer 0. Store data in hitInfo
			if ( Physics.Linecast(transform.position, otherObject.transform.position, hitInfo, layerMask ) )
			{
				var hitObject : GameObject =  hitInfo.collider.gameObject;
				//Ensure that the object hit in the raycast is an EnemyTank
				if( hitObject.tag == "EnemyTank" )
				{
					//Calculate direction, heading, and distance.
					var direction : Vector3 = otherObject.transform.position - transform.position; 
					var heading : float = Vector3.Angle( direction, transform.forward ); 
					var distance : float = direction.magnitude; 
					//Was the object hit(hitObject) the same object as the object in the radius(otherObject)
					if( hitObject == otherObject )
					{ 
						//Set object to ignore so the next iteration won't hit it
						hitObject.layer = IGNORE_LAYER; 
						//Print object data
						PrintData( hitObject.name, distance, heading );
						Debug.DrawLine (transform.position, hitObject.transform.position, Color.magenta);
					}
					else
					{
						var isDifferentObject : boolean = true;
						var hitObjectArr = new Array();
						var hitArrLen : int = hitObjectArr.length;
						//While the object we are hitting(hitObject) is not the same as (otherObject)
						while( isDifferentObject )
						{ 
							//Ignore this object for now and add it to the ignore list
							hitObject.layer = IGNORE_LAYER;
							hitObjectArr.Add( hitObject );
							//Cast again to see if we hit (otherObject)
							if( Physics.Linecast(transform.position, otherObject.transform.position, hitInfo, layerMask ) )
							{ 
								hitObject =  hitInfo.collider.gameObject;
								//Check to see if the object we hit was a tank
								if( hitObject.tag == "EnemyTank" )
								{
									 //Check to see if it was the intended tank(otherObject)
									 if( hitObject == otherObject )
									 { 
									 	//Loop through all objects set to ignore and reset them
									 	for(var iHitObject : int = hitArrLen; iHitObject >= 0 ; iHitObject--)
									 	{
									 		var tempObj1 : GameObject = hitObjectArr[ iHitObject ];
									 		if( tempObj1 != null ) 
									 		{
									 			tempObj1.layer = HIT_MASK;
									 		}
									 	}
									 	//Print out data for otherObject
									 	PrintData( otherObject.name, distance, heading );  
									 	Debug.DrawLine (transform.position, hitObject.transform.position, Color.magenta);
									 	//Break out of the loop as we found the intended object.
									 	isDifferentObject = false;
									 }
								}
								else
								{
									//Loop through all objects set to ignore and reset them
								 	for(var iHitObject2 : int = hitArrLen; iHitObject2 >= 0 ; iHitObject2--)
								 	{
								 		var tempObj2 : GameObject = hitObjectArr[ iHitObject ];
								 		if( tempObj2 != null ) 
								 		{
								 			tempObj2.layer = HIT_MASK;
								 		}
								 	}
									isDifferentObject = false;
								}
							}
							else
							{
							 	for(var iHitObject3 : int = hitArrLen; iHitObject3 >= 0 ; iHitObject3--)
							 	{
							 		var tempObj3 : GameObject = hitObjectArr[ iHitObject ];
							 		if( tempObj3 != null ) 
							 		{
							 			tempObj3.layer = HIT_MASK;
							 		}
							 	}
								isDifferentObject = false;
							}
						}
					}
				}
			}	
		}
		//print(otherObject.transform.name);
	
	}
	
	
}
 
 function PrintData( _name : String, _distance : float, _heading : float )
 {
 	var outMsg : String = "Agent: ";
	//Agent name
	outMsg += _name;
	//Append Distance
	outMsg += ", Distance: " + _distance;
	//Append Heading
	outMsg += ", Heading: " + _heading + ".";
	// Display msg
	print( outMsg );
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
