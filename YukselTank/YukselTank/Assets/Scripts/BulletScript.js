#pragma strict

/* will be implemented later on.
public var BulletDmg : float = 25.0f;
public var BulletDmgMult : float = 1.0f;
*/

function Start () 
{
	Destroy(gameObject, 5.0f);
}

function Update () {

	transform.Translate(Vector3.forward*Time.deltaTime*3);
	
	
	
	
}

function OnTriggerEnter(other : Collider) 
{
	if(other.gameObject.tag == "Wall")
	{
		print("FUAUBNFNAF");
		Destroy(gameObject);
	}
    
}
